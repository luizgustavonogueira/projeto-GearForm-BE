//Validação de email
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
  return regex.test(email)
}

//Validaçãp de senha forte 
//Mínimo 8 caracteres
//Pelo menos 1 letra maiúscula
//Pelo menos 1 letra minúscula
//Pelo menos 1 número
//Pelo menos 1 caractere especial

export function validateStrongPassword(password: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return regex.test(password)
}

//Validação de CPF

export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false
  
  // Calcula primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(9))) return false
  
  // Calcula segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== parseInt(cpf.charAt(10))) return false
  
  return true
}


//Validação de nome, pelo menos 3 caracteres

export function validateUsername(username: string): boolean {
  return username.length >= 3
} 