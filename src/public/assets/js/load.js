document.addEventListener('DOMContentLoaded', function(event) {
    fetch('index.php').then(function(response){
        return response.json();
    }).then(function(response) {
        if (!response.song || !response.file) {
            throw new Error('Bad response');
        }

        const beardle = new Beardle();
        beardle.load(response);
    }).catch(function(error) {
        alert('Something went wrong');
        console.log(error);
        return false;
    });
});
