import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useSnackbar } from "../context/snackbar";
import { useSocket } from "../context/socket";
import styles from "../styles/pages/auth.module.css";

const Signup = () => {
  const { connectSocket } = useSocket();
  const snackbarCtx = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const user = { name, username, email, password };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        connectSocket(data.user._id);
        snackbarCtx.displayMsg("Congratulations!!! Account created.");
      } else {
        snackbarCtx.displayMsg(
          "Something went wrong! Please try again.",
          "red"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className={styles["subtitle"]}>Create account</p>
      <h2 className={styles["title"]}>Let’s get to know you better!</h2>

      <form onSubmit={handleSubmit} className={styles["form"]}>
        <Input
          label="Name"
          type="text"
          id="name"
          placeholder="Type your name here"
        />
        <Input
          label="Username"
          type="text"
          id="username"
          placeholder="Type your username here"
        />
        <Input
          label="Email"
          type="email"
          id="email"
          placeholder="Type your email here"
        />
        <Input
          label="Password"
          type="password"
          id="password"
          placeholder="Type your password here"
        />
        <Button type="submit">Register</Button>
      </form>
    </>
  );
};

export default Signup;
