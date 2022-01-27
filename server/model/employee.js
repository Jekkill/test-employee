module.exports = class Employee {

    db;

    constructor(connection)
    {
        this.db = connection;
    }

    async getList()
    {
        return await this.db.any(`SELECT employee_id AS id, 
                                    employee_first_name AS first_name,
                                    employee_last_name AS last_name,
                                    string_agg(DISTINCT office_name, ',') AS office_name,
                                    employee_birthdate AS birthdate,
                                    employee_phone_number AS phone_number,
                                    string_agg(DISTINCT tag_name, ',') AS tag_names
                                   FROM employees
                                    LEFT JOIN offices ON employee_office_id = office_id
                                    LEFT JOIN employees_tags ON employee_id = employee_tag_employee_id
                                    LEFT JOIN tags ON tag_id = employee_tag_tag_id
                                    GROUP BY employee_id`);
    }

    async getOne(id)
    {
        return await this.db.any(`SELECT employee_id AS id,
                                         employee_first_name AS first_name,
                                         employee_last_name AS last_name,
                                         employee_office_id AS office_id,
                                         employee_birthdate AS birthdate,
                                         employee_phone_number AS phone_number,
                                         string_agg(CAST(employee_tag_tag_id AS text), ',') AS tags
                                  FROM employees
                                           LEFT JOIN employees_tags ON employee_id = employee_tag_employee_id
                                  WHERE employee_id = ${id}                                  
                                  GROUP BY employee_id
                                  `);
    }

    async insertOne(data)
    {
        return this.db.tx(async t => {
            const result = await t.one(`INSERT INTO employees(employee_first_name, employee_last_name, employee_office_id, employee_birthdate, employee_phone_number) 
                                    VALUES ('${data.first_name}', '${data.last_name}', ${data.office_id}, '${data.birthdate}', '${data.phone_number}') RETURNING employee_id`);
            const id = result.employee_id;
            let tagsValueString = "";
            for (let i = 0; i < data.tags.length; i++) {
                tagsValueString += `(${id}, ${data.tags[i]}), `;
            }
            tagsValueString = tagsValueString.substring(0, tagsValueString.length - 2);
            return await t.any(`INSERT INTO employees_tags(employee_tag_employee_id, employee_tag_tag_id) VALUES ${tagsValueString}`);
        });
    }

    async updateOne(data, oldData)
    {
        return this.db.tx(async t => {
            await t.any(`UPDATE employees SET employee_first_name = '${data.firstName}', 
                                                                   employee_last_name = '${data.lastName}', 
                                                                   employee_office_id = ${data.officeId}, 
                                                                   employee_birthdate = '${data.birthdate}', 
                                                                   employee_phone_number = '${data.phoneNumber}'
                                                                   WHERE employee_id = ${oldData.id}`);
            if (data.tags.join(',') !== oldData.tags) {
                const oldTags = oldData.tags?.split(',') || [];
                const newTags = data.tags;
                let newTagsToAdd = "";
                for (let i = 0; i < newTags.length; i++) {
                    if (oldTags.indexOf(newTags[i]) === -1) {
                        newTagsToAdd += `(${oldData.id}, ${newTags[i]}), `;
                    }
                }
                newTagsToAdd = newTagsToAdd.substring(0, newTagsToAdd.length - 2);
                if (newTagsToAdd !== "") {
                    await t.any(`INSERT INTO employees_tags(employee_tag_employee_id, employee_tag_tag_id) VALUES ${newTagsToAdd}`);
                }
                let oldTagsToRemove = "";
                for (let i = 0; i < oldTags.length; i++) {
                    if (newTags.indexOf(parseInt(oldTags[i])) === -1) {
                        oldTagsToRemove += `(employee_tag_employee_id = ${oldData.id} AND employee_tag_tag_id = ${oldTags[i]}) OR `;
                    }
                }
                oldTagsToRemove = oldTagsToRemove.substring(0, oldTagsToRemove.length - 3);
                if (oldTagsToRemove !== "") {
                    await t.any(`DELETE FROM employees_tags WHERE ${oldTagsToRemove}`);
                }
            }
        });
    }

    async removeOne(id)
    {
        return await this.db.any(`DELETE FROM employees WHERE employee_id = ${id}`);
    }


}