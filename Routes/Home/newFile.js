const getUser = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("connecting to database");
      resolve({ id: id, name: "Mosh" });
    }, 2000);
  });
};

const getRepositories = (username) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("fetching repositories");
      resolve(["repo1", "repo2"]);
    }, 2000);
  });
};

function getCommits(commits) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("commits");
    }, 2000);
  });
}


//
// getUser(1)
//     .then(user=>getRepositories(user))
//     .then(repos=>getCommits(repos))
//     .then(commits=> console.log(commits))
//     .catch(err=> console.log(err.message))

const displayCommits = async () => {
  const user = await getUser(1);
  const repos = await getRepositories(user);
  const commits = await getCommits(repos);
  console.log(commits);
};

console.log("before");
displayCommits()
console.log("after");

