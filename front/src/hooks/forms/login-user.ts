import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserCandidate } from "@/context/user-candidate.context";

export function useLogin() {
  // const router = useRouter()
  const {setUserCandidate} = UseUserCandidate()
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  }) 

  const {mutate, isPending} = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
    mutationKey: ["authUser"],
    onSuccess: (data) => {
      setUserCandidate(data)
      console.log(data);
    }
  })

  const onSubmit = async(data: LoginFormSchema) => {
    mutate(data)
  }

  return{onSubmit, isPending, form}
}