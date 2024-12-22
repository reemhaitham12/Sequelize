import User from "../../DB/model/User.model.js";
// 1.URL: POST /users/signup
export const signup = async (req, res,next) => {
  const { name, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const user = User.build({ name, email, password });
    await user.save();

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {

      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ errors: messages });
    }
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2.URL: PUT /users/:id
export const updateOrCreateUser = async (req, res,next) => {
    try {
        const { id } = req.params;
        const userData = req.body;
        let user = await User.findByPk(id);
        if (user) {
            await user.update(userData, { validate: false });
            res.status(200).json({ message: 'User updated successfully', user });
        } else {
            user = await User.create({ id, ...userData });
            res.status(201).json({ message: 'User created successfully', user });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3. URL: GET /users/by-email (for example /user/by-email?email=user1@gmail.com)
export const byEmail=async (req, res,next) => {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }
  
    try {
      const user = await User.findOne({
        where: { email }
      });
  
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ message: 'no user found' });
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return res.status(500).json({ message: 'An error occurred while fetching the user' });
    }
};
// 4.URL: GET /user/:id
export const id_User = async (req, res,next) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id, {
        attributes: { exclude: ['role'] } 
      });
  
      if (user) {
        return res.status(200).json(user);
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return res.status(500).json({ error: 'An error occurred while fetching the user' });
    }
};

