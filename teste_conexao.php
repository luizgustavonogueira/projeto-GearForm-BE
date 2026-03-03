<?php
require_once 'config.php';

try {
    // Teste básico
    $result = $pdo->query("SELECT 1");
    echo "conectado";
    
    // Mostrar versão do MySQL
    $versao = $pdo->query("SELECT VERSION()")->fetchColumn();
    
} catch (Exception $e) {    
    echo "sem conexão " . $e->getMessage();
}
?>