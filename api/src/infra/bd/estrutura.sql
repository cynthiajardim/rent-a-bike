DROP DATABASE IF EXISTS g4;
CREATE DATABASE IF NOT EXISTS g4 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE g4;

CREATE TABLE IF NOT EXISTS cliente(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT , 
    codigo VARCHAR(255) NOT NULL , 
    nome VARCHAR(255) NOT NULL , 
    cpf VARCHAR(11) NOT NULL , 
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(14) NOT NULL,
    email VARCHAR(255) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    foto VARCHAR(2083) NOT NULL
);

CREATE TABLE IF NOT EXISTS funcionario(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT , 
    nome VARCHAR(255) NOT NULL,
    senha VARCHAR(350) NOT NULL,
    cpf VARCHAR(11) NOT NULL,
    cargo VARCHAR(60) NOT NULL,
    sal VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS item(
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT , 
    codigo VARCHAR(255) NOT NULL , 
    descricao VARCHAR(255) NOT NULL , 
    modelo VARCHAR(255) NOT NULL , 
    fabricante VARCHAR(255) NOT NULL , 
    valorPorHora DECIMAL NOT NULL , 
    disponibilidade BOOLEAN NOT NULL DEFAULT TRUE , 
    tipo VARCHAR(60) NOT NULL 
);

CREATE TABLE IF NOT EXISTS bicicleta (
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idItem INT NOT NULL,
    numeroSeguro VARCHAR(255) NOT NULL,
    FOREIGN KEY (idItem) REFERENCES item(id)
); 

CREATE TABLE IF NOT EXISTS equipamento(
	id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    idItem INT NOT NULL,
    FOREIGN KEY (idItem) REFERENCES item(id)
);

CREATE TABLE IF NOT EXISTS locacao (
    id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
    entrada DATETIME NOT NULL,
    numero_de_horas INT NOT NULL,
    desconto DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    previsao_de_entrega DATETIME NOT NULL,
    cliente_id int NOT NULL,
    funcionario_id int NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (cliente_id) REFERENCES cliente(id),
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id)
);

CREATE TABLE IF NOT EXISTS item_locacao(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    locacao_id INT NOT NULL,
    preco_locacao DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (locacao_id) REFERENCES locacao(id)
);

CREATE TABLE IF NOT EXISTS devolucao(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    locacao_id INT NOT NULL,
    funcionario_id INT NOT NULL,
    data_de_devolucao DATETIME NOT NULL,
    valor_pago DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY(locacao_id) REFERENCES locacao(id),
    FOREIGN KEY(funcionario_id) REFERENCES funcionario(id)
);


CREATE TABLE IF NOT EXISTS avaria (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    lancamento DATETIME NOT NULL,
    descricao VARCHAR(90) NOT NULL,
    foto VARCHAR(2083) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    funcionario_id INT NOT NULL,
    item_id INT NOT NULL,
    devolucao_id INT NOT NULL,
    FOREIGN KEY (funcionario_id) REFERENCES funcionario(id),
    FOREIGN KEY (item_id) REFERENCES item(id),
    FOREIGN KEY (devolucao_id) REFERENCES devolucao(id)
);
