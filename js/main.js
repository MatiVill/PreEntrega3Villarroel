const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciar = document.querySelector("#vaciar");

let productos = []

fetch("/data/productos.json")
    .then((res) => res.json())
    .then((data) => {
        productos = [...data];
        cargarProductos(productos);
    })

const cargarProductos = (productos) => {
    contenedorProductos.innerHTML= "";
    productos.forEach((producto) => {
        let div = document.createElement("div");
        div.classList.add("producto");
        div.classList.add("etiquetaProducto");
        div.classList.add("col");
        div.innerHTML = `
            <img class="fotoProducto" src="${producto.img}">
            <h3>${producto.titulo}</h3>
            <p>$${producto.precio}</p>
    
        `;

    let button = document.createElement("button");
    button.classList.add("botonProducto");
    button.innerText = "Comprar";
    button.addEventListener("click", () => {
        agregarAlCarrito(producto);
    });

    div.append(button);
    contenedorProductos.append(div);
})
}
cargarProductos(productos);

const actualizarCarrito = () => {
    if (carrito.lenght === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciar.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciar.classList.remove("d-none");

        carritoProductos.innerHTML = ""
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio}</p>
                <p>Cant: ${producto.cantidad}</p>
               `;

            let button = document.createElement("Button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "X";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            })

            div.append(button);
            carritoProductos.append(div);
        })
    }
    actualizarTotal();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

const agregarAlCarrito = (producto) => {
    const itemEncontrado = carrito.find(item => item.id === producto.id);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();

    Toastify({
        text: "Artículo agregado al Carrito",
        duration: 2000,
        style: {
            background: "black",
            borderRadius: ".5rem",
        },
    }).showToast();
}

const borrarDelCarrito = (producto) => {
    const prodIndex = carrito.findIndex(item => item.id === producto.id);
    carrito.splice(prodIndex, 1);
    actualizarCarrito();
}

const actualizarTotal = () => {
    let total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = `$${total}`;
}

vaciar.addEventListener("click", () => {
    Swal.fire({
        title: "Quieres borrar todos los productos?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar todo",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                title: "Productos eliminados",
                icon: "success"
            });
        }
    });
})