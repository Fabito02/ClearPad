// Estilo da barra de pesquisa
const inputText = document.querySelector('.inputText');
const labelContainer = document.querySelector('.labelContainer');

inputText.addEventListener('focus', () => {
    labelContainer.classList.add('setOpacity');
});

inputText.addEventListener('blur', () => {
    labelContainer.classList.remove('setOpacity');
});

//salva os dados das anotações
function salvar() {
    const dados = document.querySelector('.corpoPosts');
    localStorage.setItem('dados', `${dados.innerHTML}`)
}

//carrega os dados das anotações
function carregar() {
    const corpoPosts = document.querySelector('.corpoPosts');
    corpoPosts.innerHTML = "";
    const dados = localStorage.getItem('dados');
    if (dados) {
        corpoPosts.innerHTML = dados;
        document.querySelectorAll('.excluir').forEach(btn => btn.addEventListener('click', excluir));
        document.querySelectorAll('.editar').forEach(btn => btn.addEventListener('click', () => editar(btn)));

        // Recria a imagem a partir do base64
        document.querySelectorAll('.postagem img').forEach(img => {
            const base64Data = img.src.split(',')[1];
            img.src = `data:image/png;base64,${base64Data}`;
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    carregar()
})

// Função para adicionar uma nova anotação
function adicionarAnotacao() {
    const inputText = document.getElementById('inputText').value;
    const imageInput = document.getElementById('image-input');
    const corpoPosts = document.querySelector('.corpoPosts');

    if (inputText.trim() === "") {
        Swal.fire({
            title: 'Espera um pouco!',
            text: 'Escreva uma anotação antes de enviar.',
            icon: 'warning',
            iconColor: '#d1550e',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ff9100'
        });
        return;
    }

    const postagem = document.createElement('div');
    postagem.classList.add('postagem');
    
    const postText = document.createElement('p');
    postText.classList.add('txt');
    postText.innerText = inputText;
    postagem.appendChild(postText);
    
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const img = document.createElement('img');
            img.src = reader.result;
            postagem.appendChild(img);
            salvar();  // Salvar após adicionar a imagem
        }
        reader.readAsDataURL(file);  // Converte o arquivo para base64
    } else {
        salvar();  // Salvar se não houver imagem
    }

    // Adiciona os botões de excluir e editar
    const excluirBtn = document.createElement('button');
    excluirBtn.classList.add('excluir');
    excluirBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    excluirBtn.addEventListener('click', function() {
        corpoPosts.removeChild(postagem);
    });
    postagem.appendChild(excluirBtn);

    const editarBtn = document.createElement('button');
    editarBtn.classList.add('editar');
    editarBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editarBtn.addEventListener('click', function() {
        editarAnotacao(postText);
    });
    postagem.appendChild(editarBtn);

    corpoPosts.appendChild(postagem);

    inputText.value = '';
    imageInput.value = '';
    salvar();
}

//função pra editar o texto de uma anotação
function editarAnotacao(postText) {
    const novoTexto = prompt("Edite o texto da anotação:", postText.innerText);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        postText.innerText = novoTexto;
    }
    salvar()
}

//função pra excluir
function excluir(event) {
    const postagem = event.target.closest('.postagem');
    postagem.remove();
    salvar();
}

//função pra editar
function editar(btn) {
    const postagem = btn.closest('.postagem');
    const newText = prompt('Edite sua anotação:', postagem.querySelector('.txt').innerText);
    if (newText !== null) {
        postagem.querySelector('.txt').innerText = newText;
        salvar(); 
    }
}


