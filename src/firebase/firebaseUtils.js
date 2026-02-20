import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const propertiesCol = collection(db, "properties");

// ADD PROPERTY (MULTIPLE IMAGES + EXTENDED FIELDS)
export async function addProperty(data, images) {
  const docRef = await addDoc(propertiesCol, {
    title: data.title || "",
    price: data.price || 0,
    location: data.location || "",
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    type: data.type || "",
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    area: data.area || "",
    facing: data.facing || "",
    parking: data.parking || "",
    description: data.description || "",
    images: images || [],
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// GET ALL PROPERTIES
export async function getProperties() {
  const q = query(propertiesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// GET SINGLE PROPERTY
export async function getPropertyById(id) {
  const d = await getDoc(doc(db, "properties", id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() };
}

// UPDATE PROPERTY (REPLACE IMAGES IF PROVIDED)
export async function updateProperty(id, data, images) {
  const docRef = doc(db, "properties", id);

  await updateDoc(docRef, {
    title: data.title || "",
    price: data.price || 0,
    location: data.location || "",
    latitude: data.latitude || null,
    longitude: data.longitude || null,
    type: data.type || "",
    bedrooms: data.bedrooms || 0,
    bathrooms: data.bathrooms || 0,
    area: data.area || "",
    facing: data.facing || "",
    parking: data.parking || "",
    description: data.description || "",
    ...(images ? { images } : {}),
  });
}

// DELETE PROPERTY
export async function deleteProperty(id) {
  await deleteDoc(doc(db, "properties", id));
}
