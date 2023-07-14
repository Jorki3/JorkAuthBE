import User from "../models/User.js";
import generateId from "../helpers/generateId.js";
import generateJWT from "../helpers/generateJWT.js";

const register = async (req, res) => {
    const { email } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
        const error = new Error("Email used");
        return res.status(403).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = generateId();

        const storedUser = await user.save();
        res.json(storedUser);
    } catch (error) {
        console.log(error);
    }
}

const authenticate = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("The user isnt exist")
        return res.status(404).json({ msg: error.message });
    }

    if (!user.confirmed) {
        const error = new Error("The count isnt confirmed")
        return res.status(403).json({ msg: error.message });
    }

    if (await user.checkPassword(password)) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user._id)
        })
    } else {
        const error = new Error("Password incorrect");
        return res.status(403).json({ msg: error.message });
    }
}

const confirm = async (req, res) => {
    const { token } = req.params;
    const userConfirm = await User.findOne({ token });

    if (!userConfirm) {
        const error = new Error("Token not valid")
        return res.status(403).json({ msg: error.message });
    }

    try {
        userConfirm.confirmed = true
        userConfirm.token = "";
        await userConfirm.save();

        res.json({ msg: "User confirm succesfully" });
    } catch (error) {
        console.log(error);
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("The user isnt exist")
        return res.status(404).json({ msg: error.message });
    }

    try {
        user.token = generateId();
        await user.save();

        res.json({ msg: "Check email sent" });
    } catch (error) {
        console.log(error);
    }
}

const checkToken = async (req, res) => {
    const { token } = req.params;
    const tokenValid = await User.findOne({ token });

    if (tokenValid) {
        res.json({ msg: "Token valid and user exist" });
    } else {
        const error = new Error("Token no valid")
        return res.status(404).json({ msg: error.message });
    }
}

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ token });

    if (user) {
        user.password = password;
        user.token = "";

        try {
            await user.save();
            res.json({ msg: "Password modified succesfully" });
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token no valid")
        return res.status(404).json({ msg: error.message });
    }
}

const profile = async (req, res) => {
    const { user } = req;

    res.json(user);
}

export {
    register,
    authenticate,
    confirm,
    forgotPassword,
    checkToken,
    newPassword,
    profile
}