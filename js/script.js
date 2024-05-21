document.addEventListener('DOMContentLoaded', function() {
    const inputBox = document.getElementById('input-box');
    const listContainer = document.getElementById('list-container');

    // Taskit ladataan local storagesta
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        // Jokaisesta tallennetusta taskista luodaan tehtäväelementti
        createTaskElement(task);
    });
    // Event Listener napin klikkaukselle
    document.querySelector('button').addEventListener('click', addTask);
    // Event Listener enter painikkeen painallukselle syötekentässä
    inputBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Jos painettu näppäin on enter, suoritetaan funktio "addTask"
            addTask();
        }
    });
    // addTask-funktio
    function addTask() {
        const taskText = inputBox.value.trim();

        // Jos syötekenttä on tyhjä, näytetään virheilmotus
        if (taskText === '') {
            showError('Tehtävä ei voi olla tyhjä');
            return;
        }
        // Jos syöte on alle 3 merkkiä, näytetään hälytys
        if (taskText.length < 3) {
            alert('Tehtävän tulee olla vähintään 3 merkkiä pitkä');
            return;
        }
        // Luodaan uusi tehtäväobjekti
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(task);
        createTaskElement(task);
        saveTasks();

        inputBox.value = '';
    }

    // Luodaan funktio 
    function createTaskElement(task) {
        // Luodaan uusi listaelementti tehtävää varten
        const li = document.createElement('li');
        li.dataset.id = task.id;
        // Jos tehtävä on merkitty suoritetuksi, lisätään siihen 'checked' luokka
        if (task.completed) {
            li.classList.add('checked');
        }
        // Asetetaan listaelementin tekstiksi tehtävän teksti
        li.textContent = task.text;
        // Kuunnellaan listaelementin klikkausta
        li.addEventListener('click', function() {
            // Merkitään tehtävä suoritetuksi/ei suoritetuksi
            task.completed = !task.completed;
            if (task.completed) {
                li.classList.add('checked');
            } else {
                li.classList.remove('checked');
            }
            // Tallennetaan muutokset local storageen
            saveTasks();
        });

        // Luodaan poistamis painike ja kuunnellaan sen klikkausta
        const deleteSpan = document.createElement('span');
        deleteSpan.textContent = 'Poista';
        deleteSpan.addEventListener('click', function(event) {
            event.stopPropagation();
            // Poistetaan tehtävälistalta ja tallennetaan muutokset local storageen
            listContainer.removeChild(li);
            tasks = tasks.filter(t => t.id !== task.id);
            saveTasks();
        });
        //Lisätään postamis painike listaelementtiin
        li.appendChild(deleteSpan);
        // Lisätään listaelementti tehtävälistalle
        listContainer.appendChild(li);
    }
    // Error funktio
    function showError(message) {
        inputBox.classList.add('error');
        // Luodaan virheilmoitus elementti
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        // Lisätään virheilmoitus syötekentän vanhempielementtiin
        inputBox.parentNode.appendChild(errorMessage);
        // Asetaan aikaraja, jonka jälkeen virheilmoitus poistuu (3sec)
        setTimeout(() => {
            inputBox.classList.remove('error');
            inputBox.parentNode.removeChild(errorMessage);
        }, 3000);
    }
    // Funktio taskien tallentamiseen local storageen
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
