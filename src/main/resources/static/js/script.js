document.addEventListener('DOMContentLoaded', function () {
    fetchProjects();
});

function fetchProjects() {
    fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            const projectSelect = document.getElementById('project-select');
            projectSelect.innerHTML = '<option value="">Select a Project</option>'; // Clear existing options
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.id;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            });
        });
}

function loadProjectBaseImage() {
    const projectId = document.getElementById('project-select').value;
    if (!projectId) return;
    fetch(`/api/projects/${projectId}/base-image`)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            document.getElementById('base-image').src = url;
            loadProjectButtons(projectId);
        });
}

function createProject() {
    const nameInput = document.getElementById('new-project-name');
    const fileInput = document.getElementById('base-image-file');

    if (!nameInput.value.trim() || !fileInput.files.length) {
        alert("Please enter a project name and select an image.");
        return;
    }

    const formData = new FormData();
    formData.append('name', nameInput.value);
    formData.append('image', fileInput.files[0]);

    fetch('/api/projects', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(() => {
            nameInput.value = ''; // Reset the input field
            fileInput.value = ''; // Clear file input
            fetchProjects(); // Reload the list of projects
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create project');
        });
}

function createButton(event) {
    const projectId = document.getElementById('project-select').value;
    if (!projectId) return;

    const image = document.getElementById('base-image');
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = x / image.width; // Get x percentage
    const yPercent = y / image.height; // Get y percentage

    const buttonName = prompt("Enter a name for this button:");
    if (!buttonName) return;

    const photoInput = document.createElement('input');
    photoInput.type = 'file';
    photoInput.accept = 'image/*';
    photoInput.onchange = function () {
        if (!this.files.length) return;
        const formData = new FormData();
        formData.append('name', buttonName);
        formData.append('x', xPercent);
        formData.append('y', yPercent);
        formData.append('photo', this.files[0]);

        fetch(`/api/projects/${projectId}/buttons`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(button => {
                // Add button marker to image
                const marker = document.createElement('div');
                marker.className = 'button-marker';
                marker.textContent = button.name;
                marker.style.left = `${x}px`;
                marker.style.top = `${y}px`;
                marker.onclick = () => alert(`Reload page to see images`);
                document.getElementById('image-container').appendChild(marker);
            })
            .then(() => {
                loadProjectButtons(projectId);
            })
    };
    photoInput.click();
}

function loadProjectBaseImage() {
    const projectId = document.getElementById('project-select').value;
    if (!projectId) return;

    fetch(`/api/projects/${projectId}/base-image`)
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            document.getElementById('base-image').src = url;
            loadProjectButtons(projectId);  // Load buttons after the image is set
        })
        .catch(error => {
            console.error('Error loading base image:', error);
            alert('Error loading base image: ' + error.message);
        });
}

function loadProjectButtons(projectId) {
    fetch(`/api/projects/${projectId}/buttons`)
        .then(response => response.json())
        .then(buttons => {
            const imageContainer = document.getElementById('image-container');
            const baseImage = document.getElementById('base-image');

            // Clear existing markers before adding new ones
            imageContainer.querySelectorAll('.button-marker').forEach(marker => marker.remove());

            buttons.forEach(button => {
                const marker = document.createElement('div');
                marker.className = 'button-marker';
                marker.textContent = button.name;
                const xPercent = button.x;
                const yPercent = button.y;
                marker.style.left = `calc(${xPercent} * ${baseImage.clientWidth}px)`;
                marker.style.top = `calc(${yPercent} * ${baseImage.clientHeight}px)`;
                marker.onclick = () => displayButtonImage(projectId, button.id); // Assuming `photoData` is base64 encoded
                marker.oncontextmenu = function (event) {
                    event.preventDefault(); // Prevent the default context menu
                    confirmDeleteButton(projectId, button.id, marker); // Call delete function
                };
                imageContainer.appendChild(marker);
            });
        })
        .catch(error => {
            console.error('Error loading buttons:', error);
            alert('Error loading buttons: ' + error.message);
        });
}

function displayButtonImage(projectId, buttonId) {
    const imageModal = document.getElementById('image-modal');
    const buttonImage = document.getElementById('button-image');
    let url = '/api/projects/' + projectId + '/buttons/' + buttonId + '/jpg'
    init(url, 'image-modal');
    animate();
    imageModal.style.display = 'block';
}

function closeModal() {
    const imageModal = document.getElementById('image-modal');
    imageModal.style.display = 'none';
    imageModal.innerHTML = '';
}

function confirmDeleteButton(projectId, buttonId, marker) {
    if (confirm("Are you sure you want to delete this button?")) {
        deleteButton(projectId, buttonId, marker);
    }
}

function deleteButton(projectId, buttonId, marker) {
    fetch(`/api/projects/${projectId}/buttons/${buttonId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                marker.remove(); // Remove the marker from the UI
                alert("Button deleted successfully.");
            } else {
                alert("Failed to delete button.");
            }
        })
        .catch(error => {
            console.error('Error deleting button:', error);
            alert('Error deleting button: ' + error.message);
        });
}

window.addEventListener('resize', () => {
    const projectId = document.getElementById('project-select').value;
    if (projectId) {
        loadProjectButtons(projectId);
    }
});


var camera, scene, renderer;
var texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

function init(url, elementId) {

    var container, mesh;

    container = document.getElementById(elementId);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

    THREE.ImageUtils.crossOrigin = '';
    var material = new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture(url)
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);

    //

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;

    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

    if (isUserInteracting === true) {

        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentMouseUp(event) {

    isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

    // WebKit

    if (event.wheelDeltaY) {

        camera.fov = Math.min(Math.max(15.0, (camera.fov - event.wheelDeltaY * 0.05)), 130.0);

        // Opera / Explorer 9

    } else if (event.wheelDelta) {

        camera.fov = Math.min(Math.max(15.0, (camera.fov - event.wheelDelta * 0.05)), 130.0);

        // Firefox

    } else if (event.detail) {

        camera.fov = Math.min(Math.max(15.0, (camera.fov + event.detail * 1.0)), 130.0);

    }

    camera.updateProjectionMatrix();

}

function animate() {

    requestAnimationFrame(animate);
    update();

}

function update() {

    if (isUserInteracting === false) {

        lon += 0.1;

    }

    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon + 180);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    renderer.render(scene, camera);

}