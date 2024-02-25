const BASE_URL = "http://localhost:8000";
window.onload = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  console.log(response.data);

  const userDOM = document.getElementById("user");
  let htmlData = "<div>";
  for (const element of response.data) {
    let user = element;
    htmlData += `<div>
      ${user.id} ${user.firstname} ${user.lastname} ${user.age} ${user.gender} 
      <a href='index.html?id=${user.id}'><button>edit</button></a>
      <button class="delete" data-id='${user.id}'>delete</button>
    </div>`;
  }

  htmlData += "</div>";
  userDOM.innerHTML = htmlData;

  const deleteButtons = document.getElementsByClassName("delete");
  for (const item of deleteButtons) {
    item.addEventListener("click", async (e) => {
      try {
        const id = e.target.dataset.id;
        const response = await axios.delete(`${BASE_URL}/users/${id}`);
        console.log(response.data);
        location.reload();
      } catch (error) {
        console.error(error.response.data.message);
      }
    });
  }
};
