import { useNavigate } from "react-router-dom";
import { signIn } from "../utils/auth";
import {useQueryClient , useMutation} from "@tanstack/react-query"

export function useLogin() {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
  
    const { mutate: signInMutation } = useMutation({
      mutationFn: (data) => signIn(data.email, data.password), 
      onSuccess: (data) => {
        console.log(data)
        // navigate('/');
      },
      onError: (error) => {
        console.log(error)
      }
    });
  
    return signInMutation
  }