# 🌌 YURIVERSE

> Um universo digital que conecta minha identidade pessoal, meus interesses, minha trajetória acadêmica e meus projetos em um único lugar.

---

## 📖 Sobre o Projeto

O **YURIVERSE** é um site pessoal desenvolvido com **HTML5, CSS3 e JavaScript**, criado para apresentar quem eu sou além de um currículo tradicional.

A proposta é oferecer uma experiência imersiva onde visitantes podem conhecer:

- Minha história;
- Meus hobbies;
- Meus gostos musicais;
- Minha Light Novel;
- Minha trajetória acadêmica;
- Minha evolução pessoal e profissional;
- Livros que influenciaram minha jornada.

O projeto é totalmente estático e acessível pela web, sem autenticação ou sistema de banco de dados.

---

# 🎯 Objetivos

- Compartilhar minha história.
- Centralizar informações pessoais e profissionais.
- Divulgar minha Light Novel.
- Organizar minhas leituras técnicas.
- Demonstrar conhecimentos em desenvolvimento front-end.
- Criar uma experiência visual única para visitantes.

---

# 🛠 Tecnologias Utilizadas

## Front-End

- HTML5
- CSS3
- JavaScript (Vanilla JS)

## Recursos

- Animações CSS
- Transições JavaScript
- Design Responsivo
- Integração com Spotify
- Galeria de Imagens
- Reprodução de Áudio

---

# 📂 Estrutura do Projeto

```text
YURIVERSE/
│
├── assets/
│   ├── audio/
│   └── imagens/
│
├── css/
│   ├── animations.css
│   ├── profissional.css
│   └── styles.css
│
├── js/
│   ├── animacoes.js
│   ├── profissional.js
│   └── script.js
│
├── index.html
├── profissional.html
│
└── README.md
```


---

# 📱 Responsividade

O projeto foi desenvolvido para funcionar em:

- Desktop
- Notebook
- Tablet
- Smartphone

---

# 🔄 Fluxo de Navegação

```mermaid
flowchart TD

A[Usuário acessa o site] --> B[Tela de Introdução]

B --> C[Clica em Entrar]

C --> D[Página Principal]

D --> E[Quem Sou]
D --> F[Minha História]
D --> G[Light Novel]
D --> H[Galeria]
D --> I[Playlist Spotify]
D --> J[Continue Explorando]

D --> K[Profissional]

K --> L[Perfil Profissional]

L --> M[Formação Acadêmica]
L --> N[Biblioteca Técnica]
L --> O[Habilidades]
L --> P[Evolução Acadêmica]

P --> Q[Encerramento da Navegação]
```

---

# 📑 Diagrama de Sequência

```mermaid
sequenceDiagram

    actor Usuario

    Usuario->>Intro: Acessa o site
    Intro-->>Usuario: Exibe animação inicial

    Usuario->>Intro: Clica em Entrar
    Intro->>Home: Carrega página principal

    Usuario->>Home: Navega em Quem Sou
    Usuario->>Home: Navega em Minha História
    Usuario->>Home: Navega em Light Novel
    Usuario->>Home: Visualiza Galeria
    Usuario->>Home: Abre Playlist Spotify

    Usuario->>Home: Clica em Profissional

    Home->>Profissional: Redireciona

    Profissional-->>Usuario: Exibe perfil profissional

    Usuario->>Profissional: Visualiza formação acadêmica
    Usuario->>Profissional: Visualiza biblioteca técnica
    Usuario->>Profissional: Visualiza habilidades
    Usuario->>Profissional: Visualiza evolução acadêmica

    Usuario->>Profissional: Finaliza navegação
```

---

# 👨‍🚀 Autor

**Yuri Oliveira**

Estudante da área de tecnologia, desenvolvedor em formação, leitor de conteúdos técnicos e criador de projetos voltados para aprendizado, organização e desenvolvimento de soluções digitais.

O YURIVERSE representa minha jornada, meus interesses e minha evolução ao longo dos estudos e experiências na área de tecnologia.
