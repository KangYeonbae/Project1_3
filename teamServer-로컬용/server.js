const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const session = require('express-session');
const dbConfig = require('./dbconfig');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {autoCommit} = require("oracledb");

oracledb.autoCommit = true;

try {
    oracledb.initOracleClient({ libDir: 'D:\\instantclient_21_14' }); // 새로 다운 받아야함
    oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
    oracledb.fetchAsString = [oracledb.CLOB];
    console.log('Oracle Instant Client 초기화 성공');
} catch (err) {
    console.error('Oracle Instant Client 초기화 실패', err);
    process.exit(1);
}


const app = express();
const port = 3001;


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use(session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


app.post('/login', async (req, res) => {
    const { userid, password } = req.body;
    if (!userid || !password) {
        return res.status(400).send('User ID와 패스워드는 필수입니다.');
    }

    const authenticatedUser = await verifyID(userid, password);
    console.log(authenticatedUser)
    if (authenticatedUser) {
        req.session.userId = authenticatedUser.id;
        return res.json({ message: '로그인 성공!', user: authenticatedUser });
    } else {
        return res.status(401).send('유효하지 않은 자격 증명입니다.');
    }
});

async function verifyID(userid, password) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'SELECT * FROM users WHERE userid = :userid AND password = :password';
        const result = await connection.execute(sql_query, [userid, password]);
        if (result.rows.length > 0) {
            return {
                id: result.rows[0].ID,
                userid: result.rows[0].USERID,
                nickname: result.rows[0].NICKNAME,
                realname: result.rows[0].REALNAME,
                mileage: result.rows[0].MILEAGE // 마일리지 필드 추가
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('오류 발생: ', error);
        throw error;
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

app.post('/purchase', async (req, res) => {
    const userId = req.session.userId;
    const { productId, price } = req.body;

    console.log('Purchasing product:', { userId, productId, price });

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    if (!productId || !price) {
        return res.status(400).send('상품 ID와 가격은 필수입니다.');
    }

    // 데이터 형식을 숫자로 변환 (필요시)
    const productIdNumber = Number(productId);
    const priceNumber = Number(price);

    if (isNaN(productIdNumber) || isNaN(priceNumber)) {
        return res.status(400).send('상품 ID와 가격은 숫자여야 합니다.');
    }

    const mileageToAdd = priceNumber * 0.1;

    console.log(`Purchasing product: User ID: ${userId}, Product ID: ${productIdNumber}, Price: ${priceNumber}, Mileage to add: ${mileageToAdd}`);

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        // const updateMileageSql = `
        //     UPDATE users
        //     SET mileage = mileage + :mileage
        //     WHERE id = :userId
        // `;
        // await connection.execute(updateMileageSql, [mileageToAdd, userId]);

        const insertTransactionSql = `
            INSERT INTO mileage_transactions (id, user_id, amount, transaction_type)
            VALUES (mileage_transactions_seq.NEXTVAL, :userId, :amount, 'add')
        `;
        await connection.execute(insertTransactionSql, [userId, mileageToAdd]);

        res.status(200).send('구매가 완료되었으며 마일리지ok.');
    } catch (error) {
        console.error('오류 발생: ', error);
        res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

app.post('/posts', upload.single('image'), async (req, res) => {
    const userId = req.session.userId;
    const { title, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // 새로운 게시글 ID 생성
        const postIdResult = await connection.execute('SELECT posts_seq.NEXTVAL FROM DUAL');
        const postId = postIdResult.rows[0][0];

        const sql_query = 'INSERT INTO posts (id, author_id, title, content, image_path) VALUES (:id, :author_id, :title, :content, :image_path)';
        await connection.execute(sql_query, [postId, userId, title, content, imagePath]);

        return res.status(200).send('게시글이 성공적으로 작성되었습니다.');
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});
async function clobToString(clob) {
    return new Promise((resolve, reject) => {
        let clobData = '';
        clob.setEncoding('utf8'); // Set the encoding to read clob data
        clob.on('data', chunk => {
            clobData += chunk;
        });
        clob.on('end', () => {
            resolve(clobData);
        });
        clob.on('error', err => {
            reject(err);
        });
    });
}
app.get('/mypage', async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'SELECT nickname, realname, mileage FROM users WHERE id = :userId';
        const result = await connection.execute(sql_query, [userId]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            return res.json({
                NICKNAME: user.NICKNAME,
                REALNAME: user.REALNAME,
                MILEAGE: user.MILEAGE
            });
        } else {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});
app.post('/mileage/use', async (req, res) => {
    const userId = req.session.userId;
    const { amount } = req.body;

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    if (!amount) {
        return res.status(400).send('마일리지 금액은 필수입니다.');
    }

    const amountNumber = Number(amount);

    if (isNaN(amountNumber)) {
        return res.status(400).send('마일리지 금액은 숫자여야 합니다.');
    }
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        // 사용자의 현재 마일리지 확인
        const checkMileageSql = 'SELECT mileage FROM users WHERE id = :userId';
        const checkResult = await connection.execute(checkMileageSql, [userId]);
        const currentMileage = checkResult.rows.length > 0 ? checkResult.rows[0].MILEAGE : 0;

        if (currentMileage < amountNumber) {
            return res.status(400).send('보유한 마일리지가 부족합니다.');
        }

        // 마일리지 차감
        // const updateMileageSql = `
        //     UPDATE users
        //     SET mileage = mileage - :amount
        //     WHERE id = :userId
        // `;
        // const updateResult = await connection.execute(updateMileageSql, { amount: amountNumber, userId: userId }, { autoCommit: true });
        // console.log(`Updated mileage: ${updateResult.rowsAffected} rows`);

        // 마일리지 차감 내역 기록
        const insertTransactionSql = `
            INSERT INTO mileage_transactions (id, user_id, amount, transaction_type)
            VALUES (mileage_transactions_seq.NEXTVAL, :userId, :amount, 'use')
        `;
        const insertResult = await connection.execute(insertTransactionSql, { userId: userId, amount: amountNumber }, { autoCommit: true });
        console.log(`Inserted transaction: ${insertResult.rowsAffected} rows`);

        res.status(200).send('마일리지가 성공적으로 차감되었습니다.');
    } catch (error) {
        console.error('오류 발생: ', error);
        res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});



app.get('/posts', async (req, res) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'SELECT id, author_id, title, content, created_at, image_path FROM posts ORDER BY created_at DESC';
        const result = await connection.execute(sql_query);
        const rows = result.rows;
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].CONTENT instanceof oracledb.Lob) {
                rows[i].CONTENT = await clobToString(rows[i].CONTENT);
            }
            if (rows[i].CREATED_AT) {
                const date = new Date(rows[i].CREATED_AT);
                rows[i].CREATED_AT = date.toISOString();
                console.log('Formatted Date:', rows[i].CREATED_AT);
            }
        }
        return res.json(rows);
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


app.get('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'SELECT id, author_id, title, content, image_path FROM posts WHERE id = :id';;
        const result = await connection.execute(sql_query, [postId]);
        if (result.rows.length > 0) {
            const post = result.rows[0];
            if (post.CONTENT instanceof oracledb.Lob) {
                post.CONTENT = await clobToString(post.CONTENT);
            }
            return res.json(post);
        } else {
            return res.status(404).send('게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// 게시글 삭제
app.delete('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const sql_query = 'DELETE FROM posts WHERE id = :id AND author_id = :author_id';
        const result = await connection.execute(sql_query, [postId, userId]);
        if (result.rowsAffected === 0) {
            return res.status(404).send('게시글을 찾을 수 없거나 삭제 권한이 없습니다.');
        }
        return res.status(200).send('게시글이 성공적으로 삭제되었습니다.');
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});

// 게시글 수정
app.put('/posts/:id', upload.single('image'), async (req, res) => {
    const userId = req.session.userId;
    const postId = req.params.id;
    const { title, content } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!userId) {
        return res.status(401).send('로그인이 필요합니다.');
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql_query = `UPDATE posts 
                           SET title = :title, content = :content, image_path = NVL(:image_path, image_path) 
                           WHERE id = :id AND author_id = :author_id`;
        const result = await connection.execute(sql_query, [title, content, imagePath, postId, userId]);
        if (result.rowsAffected === 0) {
            return res.status(404).send('게시글을 찾을 수 없거나 수정 권한이 없습니다.');
        }

        return res.status(200).send('게시글이 성공적으로 수정되었습니다.');
    } catch (error) {
        console.error('오류 발생: ', error);
        return res.status(500).send('서버 오류');
    } finally {
        if (connection) {
            await connection.close();
        }
    }
});


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; // 결과를 객체 형식으로 받기 위한 설정



app.use('/recyclingcenters', require('./routes/recycling'))
app.use('/napron', require('./routes/Napron'))
app.use('/zero', require('./routes/zero'))
// app.use('/zeroimg', require('./routes/zero_image'))
app.use('/bus', require('./routes/bus'))
app.use('/home', require('./routes/year2015'))
app.use('/home1', require('./routes/year2020'))
app.use('/b_plastic', require('./routes/b_plastic_image'))
app.use('/b_disposable', require('./routes/b_disposable_image'))
app.use('/b_foodwaste', require('./routes/b_foodwaste_image'))
app.use('/b_wasteelec', require('./routes/b_wasteelec_image'))
app.use('/b_waste', require('./routes/b_waste_image'))



app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
