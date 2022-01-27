module.exports = class Office {

    db;

    constructor(connection)
    {
        this.db = connection;
    }

    async getList()
    {
        return await this.db.any('SELECT office_id AS id, office_name AS name FROM offices');
    }

    async getOne(id)
    {
        return await this.db.any(`SELECT office_id AS id, office_name AS name FROM offices WHERE office_id = ${id}`);
    }

    async insertOne(name)
    {
        return await this.db.any(`INSERT INTO offices(office_name) VALUES ('${name}')`);
    }

    async updateOne(name, id)
    {
        return await this.db.any(`UPDATE offices SET office_name = '${name}' WHERE office_id = ${id}`)
    }

    async removeOne(id)
    {
        return await this.db.any(`DELETE FROM offices WHERE office_id = ${id}`);
    }


}