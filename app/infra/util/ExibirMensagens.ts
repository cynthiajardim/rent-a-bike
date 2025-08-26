export function exibirMensagens(mensagens: string[], erro:boolean, seletor:string) {
    const classErro = "alert";
    const classSucesso = "success";

    const output = document.querySelector<HTMLOutputElement>(seletor)!;
    if(erro == true){
        output.classList.remove(classSucesso);
        output.classList.add(classErro);
    }else{
        output.classList.remove(classErro);
        output.classList.add(classSucesso);
    }

    output.innerHTML = mensagens.join('\n');        
    output.removeAttribute('hidden');

    setTimeout(() => {
        output.setAttribute('hidden', '');
    }, 5000);    
}