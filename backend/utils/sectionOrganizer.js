export const getSection = (itemName) => {
    const name = itemName.toLowerCase();

    // Produce (Fruits and Vegetables)
    if (["apple", "banana", "tomato", "onion", "potato", "carrot", "broccoli", "spinach", "lettuce", "garlic", "ginger", "lemon", "lime", "orange", "grapes", "strawberry", "blueberry", "cucumber", "pepper"].some(item => name.includes(item)))
        return "Produce";

    // Dairy and Eggs
    if (["milk", "cheese", "butter", "yogurt", "eggs", "cream", "paneer", "ghee"].some(item => name.includes(item)))
        return "Dairy";

    // Grains, Pasta & Bread
    if (["rice", "wheat", "flour", "oats", "bread", "pasta", "noodle", "quinoa", "cereal"].some(item => name.includes(item)))
        return "Grains";

    // Canned Goods
    if (["canned", "soup", "beans", "tuna", "sauce", "paste", "broth", "stock"].some(item => name.includes(item)))
        return "Canned Goods";

    // Frozen Foods
    if (["frozen", "ice cream", "pizza", "peas", "berries"].some(item => name.includes(item)))
        return "Frozen";

    return "Others";
};