import { v4 as uuidv4 } from "uuid";
export default function UsersDao(db) {
  let { users } = db;
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    users = [...users, newUser];
    return newUser;
  };
  const findAllUsers = () => users;
  const findUserById = (userId) => users.find((user) => user._id === userId);
  const findUserByUsername = (username) =>
    users.find((user) => user.username === username);

  // Kambaz/Users/dao.js
  const findUserByCredentials = (username, password) => {
    console.log("=== DAO DEBUG ===");
    console.log("Total users in database:", users.length);
    console.log("First user in DB:", users[0] ? users[0].username : "No users");

    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    console.log("Match found:", user ? "Yes" : "No");
    return user;
  };
  const updateUser = (userId, user) =>
    (users = users.map((u) => (u._id === userId ? user : u)));
  const deleteUser = (userId) =>
    (users = users.filter((u) => u._id !== userId));
  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
  };
}
