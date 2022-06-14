function readFile(inputs) {
    let file = inputs.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        text = reader.result
        console.log(JSON.parse(text));
    };

    reader.onerror = function() {
        console.log(reader.error);
    };

}