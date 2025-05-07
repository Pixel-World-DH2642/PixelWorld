import { db } from 'src/app/firebase.js'; 
import { collection, addDoc, getDocs, query } from 'firebase/firestore';

// The dummy data for paintings
const paintings = [
  {
    id: "painting1",
    title: "Beauty",
    colorMatrix:[
        "#FFC0CB", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093", "#C71585", "#DA70D6", "#D8BFD8",
        "#DDA0DD", "#EE82EE", "#FF00FF", "#BA55D3", "#9932CC", "#9400D3", "#8A2BE2", "#9370DB",
        "#8B008B", "#800080", "#6A5ACD", "#483D8B", "#7B68EE", "#6B8E23", "#556B2F", "#8FBC8F",
        "#2E8B57", "#3CB371", "#20B2AA", "#5F9EA0", "#4682B4", "#1E90FF", "#6495ED", "#B0C4DE"
      ],
    savedQuote: "Art washes away from the soul the dust of everyday life.",
    author: "PicassoFan123",
    date: Date.now() - 100000000,
    authorNotes: "Inspired by the colors of a Spanish sunset.",
    likedBy: ["user1", "user2", "user3"],
  },
  {
    id: "painting2",
    title: "Silence in Spring",
    colorMatrix: [
        "#F4A460", "#D2B48C", "#DEB887", "#BC8F8F", "#F5DEB3", "#FFE4B5", "#FFEFD5", "#FAEBD7",
        "#FFF5EE", "#FFF8DC", "#FDF5E6", "#FFFAF0", "#FFFFF0", "#F0E68C", "#EEE8AA", "#BDB76B",
        "#FFD700", "#FFA500", "#FF8C00", "#FF7F50", "#FF6347", "#FF4500", "#DC143C", "#CD5C5C",
        "#B22222", "#A52A2A", "#8B0000", "#800000", "#4B0082", "#483D8B", "#2F4F4F", "#008B8B"
      ],
    savedQuote: "Every artist was first an amateur.",
    author: "art_lover_98",
    date: Date.now() - 50000000,
    authorNotes: "My first attempt using only shades of blue.",
    likedBy: ["user5"],
  },
  {
    id: "painting3",
    title: "Wind",
    colorMatrix: [
        "#3CB371", "#2E8B57", "#66CDAA", "#8FBC8F", "#20B2AA", "#5F9EA0", "#4682B4", "#1E90FF",
        "#6495ED", "#7B68EE", "#6A5ACD", "#483D8B", "#4B0082", "#8A2BE2", "#9932CC", "#9400D3",
        "#8B0000", "#A52A2A", "#B22222", "#DC143C", "#CD5C5C", "#F08080", "#FA8072", "#E9967A",
        "#FFA07A", "#FF7F50", "#FF6347", "#FF4500", "#FF8C00", "#FFA500", "#FFD700", "#FFFF00"
      ],
    savedQuote: "Creativity takes courage.",
    author: "beginner_painter",
    date: Date.now() - 2000000,
    authorNotes: "Experimented with pixel symmetry.",
    likedBy: [],
  },
  {
    id: "painting4",
    title: "Horse",
    colorMatrix: [
        "#1E90FF", "#87CEEB", "#ADD8E6", "#B0E0E6", "#AFEEEE", "#E0FFFF", "#F0FFFF", "#F8F8FF",
        "#F5F5F5", "#DCDCDC", "#A9A9A9", "#808080", "#696969", "#778899", "#708090", "#2F4F4F",
        "#000000", "#191970", "#00008B", "#0000CD", "#4169E1", "#6A5ACD", "#7B68EE", "#9370DB",
        "#8A2BE2", "#9400D3", "#9932CC", "#BA55D3", "#DDA0DD", "#EE82EE", "#FF00FF", "#DA70D6"
      ],
    savedQuote:
      "Two things are infinite: the universe and human stupidity; and Im not sure about the universe.",
    author: "Painter345",
    date: Date.now() - 100000000,
    authorNotes: "I painted this on a vacation",
    likedBy: ["user1", "user3"],
  },
  {
    id: "painting5",
    title: "Love in  the sky",
    colorMatrix: [
        "#FF5733", "#C70039", "#900C3F", "#581845", "#FF6F61", "#FF8C42", "#FFB347", "#FFD700",
        "#ADFF2F", "#7FFF00", "#32CD32", "#228B22", "#20B2AA", "#40E0D0", "#00CED1", "#4682B4",
        "#4169E1", "#0000FF", "#8A2BE2", "#9932CC", "#BA55D3", "#DA70D6", "#FF69B4", "#FF1493",
        "#DB7093", "#DC143C", "#B22222", "#FF4500", "#FF6347", "#FFA07A", "#F08080", "#E9967A"
      ],
    savedQuote: "I love to fly",
    author: "art_enthuisast_98",
    date: Date.now() - 50000000,
    authorNotes: "I like to paint with this app",
    likedBy: ["user5", "PicassoFan123"],
  },
];

// Function to check if paintings already exist in Firestore
async function checkExistingPaintings() {
  const paintingsRef = collection(db, "paintings");
  const querySnapshot = await getDocs(query(paintingsRef));
  return querySnapshot.size;
}

// Function to upload paintings to Firestore
async function uploadPaintings() {
  try {
    // Check if paintings already exist
    const existingCount = await checkExistingPaintings();
    
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing paintings. Skipping upload.`);
      return;
    }
    
    const paintingsRef = collection(db, "paintings");
    
    console.log(`Starting upload of ${paintings.length} paintings...`);
    
    for (let painting of paintings) {
      // Add the document to Firestore with its own ID
      await addDoc(paintingsRef, {
        ...painting,
        // Convert date to a Firestore-friendly format
        date: new Date(painting.date)
      });
      console.log(`Uploaded painting: ${painting.title}`);
    }
    
    console.log('All paintings uploaded successfully!');
  } catch (error) {
    console.error("Error uploading paintings:", error);
  }
}

export { uploadPaintings };