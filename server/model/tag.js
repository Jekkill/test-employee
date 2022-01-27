module.exports = class Tag {

    db;

    constructor(connection)
    {
        this.db = connection;
    }

    async getList()
    {
        return await this.db.any('SELECT tag_id AS id, tag_name AS name FROM tags');
    }

    async getOne(id)
    {
        return await this.db.any(`SELECT tag_id AS id, tag_name AS name FROM tags WHERE tag_id = ${id}`);
    }

    async insertOne(name)
    {
        return await this.db.any(`INSERT INTO tags(tag_name) VALUES ('${name}')`);
    }

    async updateOne(name, id)
    {
        return await this.db.any(`UPDATE tags SET tag_name = '${name}' WHERE tag_id = ${id}`)
    }

    async removeOne(id)
    {
        return await this.db.any(`DELETE FROM tags WHERE tag_id = ${id}`);
    }


}