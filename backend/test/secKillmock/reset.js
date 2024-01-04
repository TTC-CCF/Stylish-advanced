const { pool } = require('../../server/models/mysqlcon');
const Redis = require('ioredis');
const fs = require('fs');
const { TEST_ENDPOINT } = process.env;
let NUMBER1 = 1000;
let NUMBER2 = 1000;


const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    password: ''
});

redis.on("error", function (error) {
    console.error(error);
});

const seckillProducts1 = [
    {
        productId: "202401202401",
        category: "men",
        title: `五條悟圖踢`,
        description: `五條悟是木葉隱村的領袖之一，同時也是五影之一。\n他擁有卓越的忍者技能，尤其擅長木遁和太極拳等忍術。\n他的身體能夠分解成分子，使他能夠穿越物體、迅速閃避攻擊，以及進行多種變化。`,
        price: 500,
        texture: `無限`,
        wash: `摸不到`,
        place: `台灣製造`,
        note: `商品不可退換貨`,
        story: `五條悟是木葉隱村的領袖之一，同時也是五影之一。他擁有卓越的忍者技能，尤其擅長木遁和太極拳等忍術。他的身體能夠分解成分子，使他能夠穿越物體、迅速閃避攻擊，以及進行多種變化。`,
        color_ids: "1",
        sizes: "S,M,L,XL",
        main_image: "gojo1.jpg",
        other_images: ["gojo4.jpg", "gojo2.jpg", "gojo3.jpg"]
    },
    {
        productId: "202402202402",
        category: "men",
        title: `Notorious 上衣`,
        description: `館長，本名陳之漢，是台灣的網路名人，以其在社群媒體上獨特的風格和搞笑的內容而廣受歡迎。\n他的YouTube頻道以直播、搞笑、挑戰和各種娛樂內容為主，深受觀眾歡迎。`,
        price: 1000,
        texture: `很硬`,
        wash: `可水洗`,
        place: `台灣製造`,
        note: `商品不可退換貨`,
        story: `儘管館長的風格曾引起爭議，但他在網路娛樂領域的成功不可否認，並在台灣社會中建立了一個獨特的存在。 然後豬大哥沒有死!`,
        color_ids: "1,2",
        sizes: "F",
        main_image: "notorious1.jpg",
        other_images: ["notorious2.jpg", "notorious3.jpg"]
    }
]

const seckillProducts2 = [
    {
        productId: "202401202401",
        category: "accessories",
        title: `乖乖椰子口味`,
        description: `乖乖椰子口味，是乖乖的經典口味之一，椰子的香氣與乖乖的酥脆口感，讓人一吃就愛上。`,
        price: 20,
        texture: `酥脆`,
        wash: `水洗你就吃不到了`,
        place: `台灣製造`,
        note: `商品可以拿來給我吃`,
        story: `乖乖椰子口味，是乖乖的經典口味之一，椰子的香氣與乖乖的酥脆口感，讓人一吃就愛上。`,
        color_ids: "1",
        sizes: "XS",
        main_image: "save1.jpg",
        other_images: ["save3.jpeg", "save2.jpg"]
    },
    {
        productId: "202402202402",
        category: "accessories",
        title: `乳加巧克力`,
        description: `乳加巧克力是一種美味的甜點，它結合了豐富的牛奶和濃郁的巧克力，\n呈現出令人垂涎欲滴的口感和味道。這種巧克力通常採用高品質的巧克力原料，\n融合了牛奶的滑潤和甜美，創造出一種奶油且充滿層次感的味道。`,
        price: 10,
        texture: `很硬`,
        wash: `可能可以水洗`,
        place: `台灣製造`,
        note: `商品不可退換貨`,
        story: `外觀上，乳加巧克力可能呈現出光滑的表面，有時還帶有細緻的花紋或圖案，增添了一份視覺的享受。口感上，它通常具有柔軟的質地，巧克力的豐滿香氣在口中散發，而牛奶的甜味則讓整體味道更加平衡。`,
        color_ids: "1,2",
        sizes: "F",
        main_image: "choco3.png",
        other_images: ["choco2.jpg", "choco1.jpg"]
    }
]

const resetSecKill = async () => {
    await redis.flushall();
    await pool.query("DELETE FROM seckillproduct");
    await pool.query("DELETE FROM orderlist");

    // delete product
    await pool.query("DELETE FROM variant WHERE product_id = 202401202401 OR product_id = 202402202402");
    await pool.query("DELETE FROM product_images WHERE product_id = 202401202401 OR product_id = 202402202402");
    await pool.query("DELETE FROM product WHERE id = 202401202401 OR id = 202402202402");
}

const createSecKillProduct = async (secproduct) => {
    const formdatas = [];
    for (let i = 0; i < secproduct.length; i++) {
        const product = secproduct[i];
        const formdata = new FormData();
        formdata.append('product_id', product.productId);
        formdata.append('category', product.category);
        formdata.append('title', product.title);
        formdata.append('description', product.description);
        formdata.append('price', product.price);
        formdata.append('texture', product.texture);
        formdata.append('wash', product.wash);
        formdata.append('place', product.place);
        formdata.append('note', product.note);
        formdata.append('story', product.story);
        formdata.append('color_ids', product.color_ids);
        formdata.append('sizes', product.sizes);

        const main_image = await fs.openAsBlob(`${__dirname}/mock_images/${product.main_image}`, {type: 'image/jpeg'});
        formdata.append('main_image', main_image, `${__dirname}/mock_images/${product.main_image}`);

        for (let j = 0; j < product.other_images.length; j++) {
            const image = await fs.openAsBlob(`${__dirname}/mock_images/${product.other_images[j]}`, {type: 'image/jpeg'});
            formdata.append('other_images', image, `${__dirname}/mock_images/${product.other_images[j]}`);
        }
        formdatas.push(formdata);
    }

    for (let i = 0; i < formdatas.length; i++) {
        const formdata = formdatas[i];
        const result = await fetch(`${TEST_ENDPOINT}/api/1.0/admin/product`, {
            method: 'POST',
            body: formdata
        });
        const data = await result.json();
        console.log(data);
    }

    for (let i = 0; i < secproduct.length; i++) {
        const product = secproduct[i];
        const result = await fetch(`${TEST_ENDPOINT}/api/1.0/products/setKillProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.productId,
                name: product.title,
                number: i == 0 ? NUMBER1 : NUMBER2,
            })
        });
        const data = await result.json();
        console.log(data);
    }

}

(async () => {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        console.log("Usage: node reset.js [1|2] <NUMBER1> <NUMBER2>");
        process.exit();
    } else {
        NUMBER1 = args[1];
        NUMBER2 = args[2];
        await resetSecKill();
        console.log("Reset successfully!");
        if (args[0] === '1') {
            await createSecKillProduct(seckillProducts1);
        } else if (args[0] === '2'){
            await createSecKillProduct(seckillProducts2);
        }
    }
    process.exit();
})();