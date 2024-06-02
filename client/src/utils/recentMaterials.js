// utils/recentMaterials.js
export const addRecentMaterial = (material) => {
  let recentMaterials = JSON.parse(localStorage.getItem('recentMaterials')) || []
  recentMaterials = recentMaterials.filter((m) => m.path !== material.path) // Remove if it already exists
  recentMaterials.unshift(material) // Add to the beginning
  if (recentMaterials.length > 5) {
    // Limit to 5 items
    recentMaterials.pop()
  }
  localStorage.setItem('recentMaterials', JSON.stringify(recentMaterials))
}

export const getRecentMaterials = () => {
  return JSON.parse(localStorage.getItem('recentMaterials')) || []
}

export const addFaveriteLink = (material) => {
  let recentMaterials = JSON.parse(localStorage.getItem('faveritelinks')) || []
  recentMaterials = recentMaterials.filter((m) => m.path !== material.path) // Remove if it already exists



  recentMaterials.unshift(material) // Add to the beginning
  if (recentMaterials.length > 5) {
    // Limit to 5 items
    recentMaterials.pop()
  }
  localStorage.setItem('faveritelinks', JSON.stringify(recentMaterials))
}


export const removeFaveriteLink = (material) => {
  let recentMaterials = JSON.parse(localStorage.getItem('faveritelinks')) || []
  recentMaterials = recentMaterials.filter((m) => m.path !== material.path) // Remove if it already exists
  
  localStorage.setItem('faveritelinks', JSON.stringify(recentMaterials))
}

export const isFavrite = (material) => {
  let recentMaterials = JSON.parse(localStorage.getItem('faveritelinks')) || []

  for (const link in recentMaterials) {
    if (recentMaterials[link].path === material.path) {
      return true
    }
  }

  return false
}


export const getFaveriteLinks = () => {
    return JSON.parse(localStorage.getItem('faveritelinks')) || []
  }