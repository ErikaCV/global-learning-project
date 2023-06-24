// Cuando el DOM esté completamente cargado, se ejecutará esta función.
document.addEventListener("DOMContentLoaded", async () => {
  // Se realizan dos solicitudes de fetch para obtener datos de usuarios y películas desde archivos JSON locales y luego Convierte las respuestas obtenidas en objetos JSON.
  const resUsers = await fetch('../users.json');
  const resMovies = await fetch('../movies.json');

  const users = await resUsers.json();
  const movies = await resMovies.json();

  // Se agrega un listener para el evento "submit" del formulario, que previene la acción predeterminada y llama a la función filterMovies.
  document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();

    // Se seleccionan los valores de los campos del formulario.
    const userId = document.getElementById("userId").value;
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const rate = document.getElementById("rate").value;

    // Se llama a la función filterMovies con los datos del formulario y los datos obtenidos previamente.
    filterMovies({ users, movies, userId, fromDate, toDate, rate });
  });

  // se añade un evento "input" al campo userId que sólo permite el ingreso de números.
  document.getElementById("userId").addEventListener("input", (event) => {
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
  })
});

// Seleccionamos el contenedor donde se mostrarán los resultados.
const moviesContainer = document.querySelector(".movies-container");

// Función para renderizar las películas en el DOM.
function renderMovies(movies) {
  moviesContainer.innerHTML = ""; // Limpia el contenedor de resultados.
  let fragment = document.createDocumentFragment();

   // Si no hay películas que mostrar, agrega un mensaje al fragmento.
  if (movies.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No se han localizado películas que correspondan a los filtros seleccionados.";
    fragment.appendChild(message);
  } else {
    const ul = document.createElement("ul");// Crea una lista desordenada.
    
    // Para cada película, creamos un elemento li, donde se añaden detalles de la película y detalles del usuario.
    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.textContent = `Movie: ${movie.movie} - Rate: ${movie.rate}`;

      const userDetails = document.createElement("ul");
      const id = document.createElement("li");
      id.textContent = `User ID: ${movie.id}`;
      const username = document.createElement("li");
      username.textContent = `Username: ${movie.username}`;
      const email = document.createElement("li");
      email.textContent = `Email: ${movie.email}`;
      const fullAddress = document.createElement("li");
      fullAddress.textContent = `Address: ${movie.fullAddress}`;
      const company = document.createElement("li");
      company.textContent = `Company: ${movie.company}`;

      userDetails.appendChild(id);
      userDetails.appendChild(username);
      userDetails.appendChild(email);
      userDetails.appendChild(fullAddress);
      userDetails.appendChild(company);

      li.appendChild(userDetails);
      ul.appendChild(li);
    });

    fragment.appendChild(ul);// se añade la lista al fragmento.
  }
  moviesContainer.appendChild(fragment); // Añadimos el fragmento al contenedor de resultados.
}

// Función para filtrar las caracteristicas deseadas de las películas.
function filterMovies({ users, movies, userId, fromDate, toDate, rate }) {
  
  // si userId es verdadero entonces se filtran los usuarios. Si userId no es verdadero se usa el array de usuarios completo 
  let filteredUser = userId ? users.filter((user) => user.id === parseInt(userId)) : users;
  // Filtramos las películas por userId (si se proporciona), fecha y valoración.
  const filteredMovies = movies.filter((movie) => {
    return (
      (!userId || movie.userId === parseInt(userId)) &&
      new Date(movie.watched) >= new Date(fromDate) &&
      new Date(movie.watched) <= new Date(toDate) &&
      movie.rate >= parseFloat(rate)
    );
  });

  // Para cada película filtrada, busca el usuario correspondiente y retorna un nuevo objeto con los detalles de la película y del usuario.
  const detailedMovies = filteredMovies.map((movie) => {
    const user = filteredUser.find((user) => user.id === movie.userId);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullAddress: `${user.address.street} - ${user.address.city}`,
      company: user.company.name,
      movie: movie.title,
      rate: movie.rate,
    };
  });

  // Renderiza las películas con detalles de usuario en el DOM.
  renderMovies(detailedMovies);
}



