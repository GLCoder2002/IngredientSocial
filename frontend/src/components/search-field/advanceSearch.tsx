// import React, { useState } from 'react';
// import { Button, Modal } from 'antd';

// const AdvanceSearch: React.FC = () => {
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [selectedIngredients, setSelectedIngredients] = useState<any>([]);
//   const [posts, setPosts] = useState<any>([]);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };

//   const handleOk = () => {
//     setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };
  
//   const handleIngredientChange = (event:any) => {
//     const { name, checked } = event.target;
//     if (checked) {
//       setSelectedIngredients([...selectedIngredients, name]);
//     } else {
//       setSelectedIngredients(selectedIngredients.filter((ingredient:any) => ingredient !== name));
//     }
//   };
  
//   const findPostsByIngredients = async () => {
//     // Make an API request to fetch posts based on selectedIngredients
//     try {
//       const response = await fetch(`/api/posts/findPostsByIngredients?ingredients=${selectedIngredients.join(',')}`);
//       const data = await response.json();
//       setPosts(data);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     }
//   };

//   return (
//     <>
//       <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
//     <div>
//       <h2>Ingredient Selection</h2>
//       <div>
//         {ingredients.map((ingredient) => (
//           <label key={ingredient.name}>
//             <input
//               type="checkbox"
//               name={ingredient.name}
//               onChange={handleIngredientChange}
//               checked={selectedIngredients.includes(ingredient.name)}
//             />
//             {ingredient.name}
//           </label>
//         ))}
//       </div>
//       <button onClick={findPostsByIngredients}>Find Posts</button>
//       {/* Render the list of posts */}
//     </div>
//       </Modal>
//     </>
//   );
// };

// export default AdvanceSearch;

export{}