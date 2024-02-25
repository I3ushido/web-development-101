const BASE_URL = "http://localhost:8000";

let mode = "CREATE";
let selectedUserId = "";

window.onload = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log("🚀 ~ window.onload= ~ id:", id);
  if (id) {
    mode = "UPDATE";
    selectedUserId = id;
    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data;
      console.log("🚀 ~ window.onload= ~ response:", response.data);
      let firstNameDOM = document.querySelector("input[name=first_name]");
      let lastNameDOM = document.querySelector("input[name=last_name]");
      let ageDOM = document.querySelector("input[name=age]");
      let descriptionDOM = document.querySelector("textarea[name=description]");

      let genderDOMs = document.querySelectorAll("input[name=gender]");
      let interestDOMs = document.querySelectorAll("input[name=interest]");

      for (const element of genderDOMs) {
        if (element.value === user.gender) {
          element.checked = true;
        }
      }

      for (const element of interestDOMs) {
        if (user.interests.includes(element.value)) {
          element.checked = true;
        }
      }

      console.log(JSON.stringify(user, null, 2));
      firstNameDOM.value = user.firstname;
      lastNameDOM.value = user.lastname;
      ageDOM.value = user.age;
      descriptionDOM.value = user.description;
    } catch (error) {
      console.error(error.response);
    }
  }
};

const validateDate = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("First name is required");
  }
  if (!userData.lastname) {
    errors.push("Last name is required");
  }
  if (!userData.age) {
    errors.push("Age is required");
  }
  if (!userData.gender) {
    errors.push("Gender is required");
  }
  if (!userData.interests) {
    errors.push("Interests is required");
  }
  if (!userData.description) {
    errors.push("Description is required");
  }
  return errors;
};

const submitData = async () => {
  let firstNameDOM = document.querySelector("input[name=first_name]");
  let lastNameDOM = document.querySelector("input[name=last_name]");
  let ageDOM = document.querySelector("input[name=age]");
  let genderDOM = document.querySelector("input[name=gender]:checked") || {};
  let interestDOMs =
    document.querySelectorAll("input[name=interest]:checked") || {};
  let descriptionDOM = document.querySelector("textarea[name=description]");
  let messageDOM = document.getElementById("message");

  try {
    let interest = [...interestDOMs].map((interest) => interest.value);
    interest = interest.join(", ");

    let userData = {
      firstname: firstNameDOM.value,
      lastname: lastNameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      interests: interest,
      description: descriptionDOM.value || "nothing",
    };
    console.log("🚀 ~ submitData ~ userData:", userData);

    const errors = validateDate(userData);
    if (errors.length > 0) {
      throw {
        message: "Data not valid!",
        errors: errors,
      };
    }

    if (mode === "CREATE") {
      const response = await axios.post(`${BASE_URL}/users`, userData);
      console.log("Submit:UserData: ", response.data);
      messageDOM.innerText = "User created successfully";
      messageDOM.className = "message success";
    } else {
      const response = await axios.put(
        `${BASE_URL}/users/${selectedUserId}`,
        userData
      );
      console.log("Submit:UserData: ", response.data);
      messageDOM.innerText = "User updated successfully";
      messageDOM.className = "message success";
    }
  } catch (error) {
    if (error.response) {
      console.error("Submit:Error: ", error.response);
      error.message = error.response.data.message;
      error.errors = error.response.data.errors;
    }
    let htmlData = "<div>";
    htmlData += `<div>${error.message}</div>`;
    htmlData += "<ul>";
    for (const element of error.errors) {
      htmlData += `<li>${element}</li>`;
    }
    htmlData += "</ul>";
    htmlData += "</div>";
    //"Error creating user";
    messageDOM.innerHTML = htmlData;
    messageDOM.className = "message danger";
  }
};
