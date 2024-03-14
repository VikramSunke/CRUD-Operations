const baseUrl = 'https://localhost:7155/api/Employees';


const tablebodyElement=document.getElementById('table_body');
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
});

async function fetchPosts() {
    const headers = new Headers();
    const response = await fetch(baseUrl, {
        method: 'GET',
        headers: headers,
    });
    
    const posts = await response.json();

    let tableRows = '';

    for (let post of posts) {
        tableRows +=
            `<tr>
                <td>${post.emp_Id}</td>
                <td>${post.name}</td>
                <td>${post.department}</td>
                <td><button class="update_button">UPDATE</button>
                <button class="delete_button">DELETE</button></td>
            </tr>`;
    }

    tablebodyElement.innerHTML = tableRows;
}

const addPostButton=document.getElementById('add_employee');
addPostButton.addEventListener('click',()=>{
    let addRecord=document.getElementById('add_page');
    addRecord.style.display='block';
    
    document.getElementById('empId').value = '';
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
});
function closeModal(){
    let addRecord=document.getElementById('add_page');
    addRecord.style.display='none';
    document.getElementById('update_modal').style.display='none';
}

const closeButton=document.getElementsByClassName('close');

closeButton[0].addEventListener('click',()=>{
    closeModal();
})

const cancelButton=document.getElementsByClassName('cancel_button');
cancelButton[0].addEventListener('click',()=>{
    closeModal();
})

const addModel = document.getElementById('add_page');
addModel.addEventListener('submit', async (e) => {
    e.preventDefault();

    const employeeId = document.getElementById('empId').value; 
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    let postData = {
        emp_Id: employeeId,
        name: title,
        department: description,
    };

    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });

    const newPost = await response.json();
    console.log('New record added:', newPost);
    fetchPosts();
    closeModal();
});


tablebodyElement.addEventListener('click', async (e) => {
    let target = e.target;
    if (target.classList.contains('delete_button')) {
        let postId = target.parentElement.parentElement.firstElementChild.textContent;

        const response = await fetch(`${baseUrl}/${postId}`, {
            method: 'DELETE'
        });
        console.log('Record deleted successfully', response);
        fetchPosts();
    }
});

let updatedpostId = '';

tablebodyElement.addEventListener('click', async (e) => {
    let target = e.target;
    if (target.classList.contains('update_button')) {
        document.getElementById('update_modal').style.display = 'block';

        let postId = parseInt(target.parentElement.parentElement.firstElementChild.innerHTML, 10);
        updatedpostId = postId;

        const response = await fetch(baseUrl);
        const posts = await response.json();

        let selectedRecord = posts.find((post) => post.emp_Id === postId);
        document.getElementById('empIdUpdate').value = selectedRecord.emp_Id;
        document.getElementById('titleUpdate').value = selectedRecord.name;
        document.getElementById('descriptionUpdate').value = selectedRecord.department;
    }
});

let updateModal = document.getElementById('update_modal');
updateModal.addEventListener('submit', async (e) => {
    e.preventDefault();
    let eUId = document.getElementById('empIdUpdate').value;
    let updatedTitle = document.getElementById('titleUpdate').value;
    let updatedBody = document.getElementById('descriptionUpdate').value;

    let updatedPost = {
        emp_Id: eUId,
        name: updatedTitle,
        department: updatedBody,
    };

    const response = await fetch(`${baseUrl}/${updatedpostId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json', // Set the Content-Type header to JSON
        },
        body: JSON.stringify(updatedPost),
    });

    console.log(response);
    fetchPosts();
    closeModal();
});
