
export const originSuggestions = () => {
    console.log('Api call')
    fetch('https://run.mocky.io/v3/89c1e7c2-5abe-4f86-946a-c227b11b0860')
        .then((response) => response.json())
        .then((json) => {
            return json.data.originSuggestions
        })
        .catch((error) => console.error(error))
}
  
  