import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export const SignupPage = () => {

    const schema = yup.object().shape({
        username: yup.string().required("Username is required"),
        email: yup.string().email().required(),
        password: yup.string().max(30).required(),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords don't match").required()
    });

    const { register, handleSubmit, formState: {errors} } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = () => {

    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="text" placeholder="Username..." {...register("username")} />
            <p>{errors.username?.message}</p>
            <input type="email" placeholder="Email..." {...register("email")} />
            <input type="password" placeholder="Password..." {...register("password")}/>
            <input type="password" placeholder="Confirm Password..." {...register("confirmPassword")}/>
            <p>{errors.confirmPassword?.message}</p>
            <input type="submit" />
        </form>
    )
}