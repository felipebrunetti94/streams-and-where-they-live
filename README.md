## What is a stream?

Stream é um fluxo de dados ao longo do tempo.

## Where they live?

## Why?

Digamos que você quer ver um filme, você entra no seu provedor de filmes de preferência e aperta play, o que acontece?

### Sem streams

Você espera até o filme inteiro ser baixado, e por um filme ser um arquivo muito grande isso pode levar algum tempo antes de poder assistir qualquer coisa.

![Arquivo muito grande acabando com sua memória](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/hsug4l1los4zwdncrymx.png)

### Com streams

Diferente do caso anterior onde os dados só são processados na memória de uma vez só, dados em Stream vão vir em pacotinhos(chamados chunks), onde vc pode processar eles individualmente.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vi8m1xrdl6leih9m5zbg.png)

Alguns outros casos de uso para Stream são:

- multimedia
- transferencia de arquivos
- descompressão e compressão
- são a interface padrão para a input/output(I/O) em sistemas Unix

Pronto, agora que você leitor está convencido, ou não... sobre a importância das Streams bora ver alguns conceitos.

## Como funciona?

[EXPLICAR AQUI OS COMPONENTES DE UMA STREAM]

### Interface

Esse exemplos vão ter como base as specs do [whatwg.org](https://streams.spec.whatwg.org/)
as interfaces são readable streams, writable streams, e transform streams.

#### Chunk

É um pedacinho de dado que pode ser lido ou escrito numa stream. Detalhe importante, chunks não precisam ser do mesmo tipo.

#### Readable Streams

É uma fonte de dados representado no Javascript pelo objeto ReadableStream, que tira os dados de um _underlying source_, os quais pode ser do tipo:

- Push: manda dados constantemente pra vc sem te perguntar se vc quer mais.
- Pull: manda dados apenas quando vc pede.

Quando os chunks estão na stream dizemos que eles estão enqueued(tão na espera), existe uma fila interna que controla os chunks ainda não lidos, mas vamos fingir que isso não existe, por enquanto...

Os Chunks dentro da stream vão ser lidos pelo _reader_ que le eles um por vez, que por sua vez passa esses dados para um _consumer_.

Existe um construtor chamado controller, caso vc queira cancelar a stream por exemplo.

Cada Stream só pode ter um _reader_ por vez, uma vez que ele ta lendo dizemos que a stream está _locked_. Porém há meios de vc ler os mesmos dados, logo mais falamos disso.

Exemplos de ReadableStreams são o Response.body de um fetch

`fetch('url')
  .then(response => 
    response.body// esse cara é um RedableStream
  )`

O objeto ReadableStream recebe dois parametros o primeiro cria um modelo do underlying source
`const underlyingSourceModel = {
  start(controller) {}, // chamado imediatamente quando o objeto é construido
  pull(controller) {}, // chamado até que internal queue esteja cheia
  cancel() {}, // chamado quando o método ReadableStream.cancel() for chamado
}`

o segundo parametro é opcional e ele especifíca uma queuing strategy

`const queuingStratety = {
  highWaterMark,
  size(){}
}`

#### Writable Streams

#### Transform Streams

#### Pipe chains

#### Teeing

#### Backpressure

A situações em que uma stream le ou escreve dados mais rápido que a próxima stream consegue processar.
Exemplo é zipar um arquivo, ler do disco é mais rápido que escrever, desse modo o processo de leitura vai fornecer mais info do que a escrita consegue processar.
Isso acarreta nos seguintes problemas:

- Desacelera todos os demais processos
- Sobrecarga no garbage collector
- Uso excessivo de memória

Para evitar isso o Stream que está acumulando demais, vai usar o Backpressure que é basicamente sinalizar para quem está enviando para desacelerar.

### Node

[EXPLICAR AQUI QUAIS AS DIFERENÇAS COM NODE]
