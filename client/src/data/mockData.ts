import { Product, Recipe, ShoppingList, MealPlan, ExpenseRecord } from '../contexts/AppContext';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Gạo thơm Jasmine',
    category: 'Thực phẩm cơ bản',
    description: 'Gạo thơm cao cấp từ Thái Lan',
    originalPrice: 45000,
    price: 38000,
    unit: 'kg',
    image: '/images/rice.jpg',
    discount: 15,
    rating: 4.8,
    stock: 150
  },
  {
    id: '2',
    name: 'Thịt heo ba chỉ',
    category: 'Thịt tươi',
    description: 'Thịt heo ba chỉ tươi ngon',
    price: 125000,
    unit: 'kg',
    image: '/images/pork.jpg',
    rating: 4.6,
    stock: 25
  },
  {
    id: '3',
    name: 'Cà chua bi',
    category: 'Rau củ',
    description: 'Cà chua bi tươi ngon, giàu vitamin',
    originalPrice: 25000,
    price: 18000,
    unit: 'kg',
    image: '/images/tomato.jpg',
    discount: 28,
    rating: 4.7,
    stock: 80
  },
  {
    id: '4',
    name: 'Dầu ăn Neptune',
    category: 'Gia vị',
    description: 'Dầu ăn cao cấp từ đậu nành',
    price: 75000,
    unit: 'chai',
    image: '/images/oil.jpg',
    rating: 4.5,
    stock: 60
  },
  {
    id: '5',
    name: 'Sữa tươi TH True Milk',
    category: 'Sữa & Trứng',
    description: 'Sữa tươi nguyên chất không đường',
    price: 28000,
    unit: 'hộp',
    image: '/images/milk.jpg',
    rating: 4.9,
    stock: 200
  },
  {
    id: '6',
    name: 'Bánh mì sandwich',
    category: 'Bánh kẹo',
    description: 'Bánh mì sandwich tươi mỗi ngày',
    originalPrice: 15000,
    price: 12000,
    unit: 'ổ',
    image: '/images/bread.jpg',
    discount: 20,
    rating: 4.4,
    stock: 45
  },
  {
    id: '7',
    name: 'Cá hồi Na Uy',
    category: 'Hải sản',
    description: 'Cá hồi tươi nhập khẩu từ Na Uy',
    price: 280000,
    unit: 'kg',
    image: '/images/salmon.jpg',
    rating: 4.8,
    stock: 15
  },
  {
    id: '8',
    name: 'Táo Envy',
    category: 'Trái cây',
    description: 'Táo Envy giòn ngọt từ New Zealand',
    price: 65000,
    unit: 'kg',
    image: '/images/apple.jpg',
    rating: 4.6,
    stock: 90
  },
  {
    id: '9',
    name: 'Rau xà lách',
    category: 'Rau củ',
    description: 'Rau xà lách tươi organic',
    price: 20000,
    unit: 'bó',
    image: '/images/lettuce.jpg',
    rating: 4.3,
    stock: 120
  },
  {
    id: '10',
    name: 'Trứng gà ta',
    category: 'Sữa & Trứng',
    description: 'Trứng gà ta tươi ngon',
    price: 3500,
    unit: 'quả',
    image: '/images/egg.jpg',
    rating: 4.7,
    stock: 300
  }
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Phở bò Hà Nội',
    description: 'Món phở bò truyền thống với nước dùng đậm đà',
    cookTime: 180,
    servings: 4,
    image: '/images/pho.jpg',
    tags: ['Việt Nam', 'Nước dùng', 'Bò'],
    difficulty: 'hard',
    ingredients: [
      { name: 'Xương bò', amount: '1', unit: 'kg' },
      { name: 'Thịt bò tái', amount: '300', unit: 'g' },
      { name: 'Bánh phở', amount: '400', unit: 'g' },
      { name: 'Hành tây', amount: '2', unit: 'củ' },
      { name: 'Gừng', amount: '50', unit: 'g' },
      { name: 'Quế', amount: '2', unit: 'thanh' },
      { name: 'Hoa hồi', amount: '3', unit: 'cái' }
    ],
    instructions: [
      'Niêu xương bò 30 phút để loại bỏ tạp chất',
      'Nướng hành tây và gừng đến thơm',
      'Nấu nước dùng với xương bò và gia vị trong 3 giờ',
      'Trần bánh phở trong nước sôi',
      'Cắt thịt bò mỏng, xếp lên bánh phở',
      'Chan nước dùng nóng, thêm hành lá, ngò gai'
    ]
  },
  {
    id: '2',
    name: 'Gà rán KFC',
    description: 'Gà rán giòn tan theo công thức bí mật',
    cookTime: 45,
    servings: 2,
    image: '/images/fried-chicken.jpg',
    tags: ['Chiên', 'Gà', 'Nhanh'],
    difficulty: 'medium',
    ingredients: [
      { name: 'Đùi gà', amount: '4', unit: 'cái' },
      { name: 'Bột mì', amount: '200', unit: 'g' },
      { name: 'Bột ngô', amount: '50', unit: 'g' },
      { name: 'Trứng gà', amount: '2', unit: 'quả' },
      { name: 'Sữa tươi', amount: '100', unit: 'ml' },
      { name: 'Muối', amount: '1', unit: 'tsp' },
      { name: 'Tiêu', amount: '1/2', unit: 'tsp' }
    ],
    instructions: [
      'Ướp gà với muối, tiêu 30 phút',
      'Trộn bột mì, bột ngô với gia vị',
      'Nhúng gà vào trứng và sữa',
      'Lăn gà trong hỗn hợp bột',
      'Chiên gà trong dầu nóng 170°C trong 15 phút',
      'Vớt ra để ráo dầu'
    ]
  },
  {
    id: '3',
    name: 'Salad Caesar',
    description: 'Salad Caesar tươi mát với sốt đặc biệt',
    cookTime: 15,
    servings: 2,
    image: '/images/caesar-salad.jpg',
    tags: ['Salad', 'Tươi mát', 'Nhanh'],
    difficulty: 'easy',
    ingredients: [
      { name: 'Rau xà lách', amount: '200', unit: 'g' },
      { name: 'Phô mai Parmesan', amount: '50', unit: 'g' },
      { name: 'Bánh mì', amount: '4', unit: 'lát' },
      { name: 'Dầu ô liu', amount: '3', unit: 'tbsp' },
      { name: 'Tỏi', amount: '2', unit: 'tép' },
      { name: 'Chanh', amount: '1', unit: 'quả' }
    ],
    instructions: [
      'Rửa sạch rau xà lách, cắt vừa ăn',
      'Cắt bánh mì thành hình vuông nhỏ, nướng giòn',
      'Làm sốt Caesar với dầu ô liu, tỏi, nước chanh',
      'Trộn rau với sốt',
      'Rắc phô mai và bánh mì nướng lên trên'
    ]
  },
  {
    id: '4',
    name: 'Cơm tấm sườn nướng',
    description: 'Cơm tấm sườn nướng thơm ngon đặc trưng Sài Gòn',
    cookTime: 60,
    servings: 3,
    image: '/images/com-tam.jpg',
    tags: ['Việt Nam', 'Nướng', 'Cơm'],
    difficulty: 'medium',
    ingredients: [
      { name: 'Gạo tấm', amount: '300', unit: 'g' },
      { name: 'Sườn heo', amount: '500', unit: 'g' },
      { name: 'Trứng', amount: '3', unit: 'quả' },
      { name: 'Đường', amount: '2', unit: 'tbsp' },
      { name: 'Nước mắm', amount: '3', unit: 'tbsp' },
      { name: 'Tỏi', amount: '3', unit: 'tép' }
    ],
    instructions: [
      'Ướp sườn với đường, nước mắm, tỏi băm trong 30 phút',
      'Nấu cơm tấm',
      'Nướng sườn trên than hoa đến chín vàng',
      'Chiên trứng ốp la',
      'Bày cơm, sườn, trứng ra đĩa',
      'Ăn kèm với nước mắm pha'
    ]
  }
];

export const mockShoppingLists: ShoppingList[] = [
  {
    id: '1',
    name: 'Danh sách mua sắm tuần này',
    date: '2024-01-15',
    completed: false,
    groupId: '1',
    shoppingItems: [
      {
        id: '1',
        name: 'Gạo thơm',
        quantity: 2,
        unit: 'kg',
        category: 'Thực phẩm cơ bản',
        completed: true,
        priority: 'high'
      },
      {
        id: '2',
        name: 'Thịt heo',
        quantity: 1,
        unit: 'kg',
        category: 'Thịt tươi',
        completed: false,
        priority: 'high'
      },
      {
        id: '3',
        name: 'Rau cải',
        quantity: 3,
        unit: 'bó',
        category: 'Rau củ',
        completed: false,
        priority: 'medium'
      },
      {
        id: '4',
        name: 'Sữa tươi',
        quantity: 2,
        unit: 'hộp',
        category: 'Sữa & Trứng',
        completed: true,
        priority: 'medium'
      }
    ]
  },
  {
    id: '2',
    name: 'Chuẩn bị tiệc cuối tuần',
    date: '2024-01-20',
    completed: true,
    groupId: '1',
    shoppingItems: [
      {
        id: '5',
        name: 'Thịt bò',
        quantity: 2,
        unit: 'kg',
        category: 'Thịt tươi',
        completed: true,
        priority: 'high'
      },
      {
        id: '6',
        name: 'Bánh mì',
        quantity: 5,
        unit: 'ổ',
        category: 'Bánh kẹo',
        completed: true,
        priority: 'low'
      }
    ]
  }
];

export const mockMealPlans: MealPlan[] = [
  {
    id: '1',
    date: '2024-01-15',
    breakfast: mockRecipes.find(r => r.id === '3'),
    lunch: mockRecipes.find(r => r.id === '4'),
    dinner: mockRecipes.find(r => r.id === '1')
  },
  {
    id: '2',
    date: '2024-01-16',
    breakfast: undefined,
    lunch: mockRecipes.find(r => r.id === '2'),
    dinner: undefined
  }
];

export const mockExpenses: ExpenseRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    amount: 450000,
    category: 'Thực phẩm cơ bản',
    items: ['Gạo', 'Dầu ăn', 'Nước mắm'],
    description: 'Mua sắm hàng tuần'
  },
  {
    id: '2',
    date: '2024-01-14',
    amount: 280000,
    category: 'Thịt tươi',
    items: ['Thịt heo', 'Thịt bò'],
    description: 'Thịt cho tuần này'
  },
  {
    id: '3',
    date: '2024-01-13',
    amount: 150000,
    category: 'Rau củ',
    items: ['Cà chua', 'Rau xà lách', 'Hành tây'],
    description: 'Rau củ tươi'
  },
  {
    id: '4',
    date: '2024-01-12',
    amount: 95000,
    category: 'Trái cây',
    items: ['Táo', 'Cam', 'Chuối'],
    description: 'Trái cây cho gia đình'
  },
  {
    id: '5',
    date: '2024-01-11',
    amount: 65000,
    category: 'Sữa & Trứng',
    items: ['Sữa tươi', 'Trứng gà'],
    description: 'Sữa và trứng'
  }
];

export const mockUsers = [
  {
    "id": "1001",
    "name": "demo user 1",
    "email": "demo1@gmail.com"
  },
  {
    "id": "1002",
    "name": "demo user 2",
    "email": "demo2@gmail.com"
  }
];
