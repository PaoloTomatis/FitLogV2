import pool from "./database.js";

const getUser = async (identificative, field) => {
    let rows;

    switch (field) {
        case "id":
            [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [identificative]);
            break;
        
        case "username":
            [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [identificative]);
            break;
        
        case "email":
            [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [identificative]);
            break;
        
        case "psw":
            [rows] = await pool.query("SELECT * FROM users WHERE psw = ?", [identificative]);
            break;

        case "refreshToken":
            [rows] = await pool.query("SELECT * FROM users WHERE refreshToken = ?", [identificative]);
            break;
    
        default:
            rows = [];
            break;
    }

    return rows[0];
};

const addUser = async (username, email, psw) => {
    if (!username || !email || !psw) return "error";
    await pool.query("INSERT INTO users (username, email, psw) VALUES (?, ?, ?)", [username, email, psw]);
    return;
}

const getUsers = async () => {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
}

const updateUser = async (id, update, field) => {
    if (!id || !update || !field) return "error";
    const query = `UPDATE users SET ${field} = ? WHERE id = ?`;
    await pool.query(query, [update, id]);
    return;
}

export default { getUser, addUser, getUsers, updateUser };