const { pool } = require('../../server/models/mysqlcon');
const Redis = require('ioredis');
const fs = require('fs');
const { TEST_ENDPOINT } = process.env;

const redis = new Redis({
    host: '127.0.0.1',
    port: 6379,
    password: ''
});

redis.on("error", function (error) {
    console.error(error);
});

//五條悟圖踢

const seckillProducts = [
    {
        productId: "202401202401",
        category: "men",
        title: `五條悟圖踢`,
        description: `五條悟是木葉隱村的領袖之一，同時也是五影之一。\n他擁有卓越的忍者技能，尤其擅長木遁和太極拳等忍術。\n他的身體能夠分解成分子，使他能夠穿越物體、迅速閃避攻擊，以及進行多種變化。`,
        price: 34000,
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
        price: 20000,
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

const resetSecKill = async () => {
    await redis.flushall();
    await pool.query("DELETE FROM seckillproduct");
    await pool.query("DELETE FROM orderlist");

    // delete product
    await pool.query("DELETE FROM variant WHERE product_id = 202401202401 OR product_id = 202402202402");
    await pool.query("DELETE FROM product_images WHERE product_id = 202401202401 OR product_id = 202402202402");
    await pool.query("DELETE FROM product WHERE id = 202401202401 OR id = 202402202402");
}

const createSecKillProduct = async () => {
    const formdatas = [];
    for (let i = 0; i < seckillProducts.length; i++) {
        const product = seckillProducts[i];
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

    for (let i = 0; i < seckillProducts.length; i++) {
        const product = seckillProducts[i];
        const result = await fetch(`${TEST_ENDPOINT}/api/1.0/products/setKillProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: product.productId,
                name: product.title,
                number: 1000,
            })
        });
        const data = await result.json();
        console.log(data);
    }

}


(async () => {
    await resetSecKill();
    console.log("Reset successfully!");
    await createSecKillProduct();
    process.exit();
})();
