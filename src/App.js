import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    api.get("repositories").then((resp) => {
      setRepos(resp.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const resp = await api.post(`/repositories/${id}/like`)
    const likeRepo = resp.data
    
    const repoUpdate = repos.map(rep => {
       let newRepo = {...rep}
       if(rep.id === id){
         newRepo.likes = likeRepo.likes;
       }
       return newRepo
    })
    setRepos(repoUpdate)
  }

  async function handleAddProject() {
    const response = await api.post("repositories", {
      title: "Novo Repositório " + Date.now(),
		url: "http://github.com/newrepo"+Date.now(),
      techs: ["NodeJs", "React-Native"]
    });

    setRepos([...repos, response.data]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.containerTitle}>
          <Text style={styles.title}>REPOSITÓRIOS</Text>
          <TouchableOpacity style={styles.btnAdd} onPress={handleAddProject}>
            <Text style={styles.btnText}>Adicionar Repositório</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.repositoryContainer}
          data={repos}
          keyExtractor={(repo) => repo.id}
          renderItem={({ item: repository }) => (
            <>
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{repository.title}</Text>

                <View style={styles.techsContainer}>
                  {repository.techs.map((tech) => (<Text key={tech} style={styles.tech}>{tech}</Text>))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                    testID={`repository-likes-${repository.id}`}
                  >
                    {repository.likes} curtidas
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(repository.id)}
                  // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                  testID={`like-button-${repository.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  containerTitle: {
   flexDirection: "column",
   justifyContent: "space-between",
    backgroundColor: "#7159c1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom:10, 
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  btnAdd: {
    alignSelf: "stretch",
    margin: 15,
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
