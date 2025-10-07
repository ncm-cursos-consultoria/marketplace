import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormSchema, loginFormSchema } from "../schemas/login-formschema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/service/auth/login";
import { useRouter } from "next/navigation";
import { UseUserPartner } from "@/context/user-partner.context";

export function useLoginPartner() {
  const {userPartner, setUserPartner} = UseUserPartner()
  const router = useRouter()
  const queryClient = useQueryClient()
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema)
  })

  const {mutate, isPending} = useMutation({
    mutationFn: (data: LoginFormSchema) => login(data),
    mutationKey: ['partner-user'],
    onSuccess: (data) => {
      console.log(data);
      
      setUserPartner(data)
      queryClient.invalidateQueries({queryKey: ['partner-user']})
      setTimeout(() => {
        router.push(`/partner/${userPartner?.partnerId}`)
      }) 
    }
  })

  const onSubmit = async(data: LoginFormSchema) => {
    console.log(data);
    
    mutate(data)
  }

  return{onSubmit, form, isPending}
}