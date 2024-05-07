import express from 'express';
import { isAuthenticated } from "../middleware/check_auth";
import * as Session from "../middleware/session";
import * as UserDB from "../db/db_users"
import * as Chat from "../controllers/ctrl_chat";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('landing');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get("/lobby", isAuthenticated, (req, res) => {

    const { username: currentUser, id: currentUserId } = Session.getCurrentUser(req);

    res.render("lobby", { currentUser, currentUserId });
});

router.get('/game/:id', isAuthenticated, (req, res) => {

    
    /* 
    TODO

    1. update unogame.ejs

    2. lobby.ejs is updated with game list that allow user to join
       if game is not started, redirect user to /game/:id/wait

    3. add isUserInGame check later  
    */
    const { id: gameId } = req.params;

    res.render('unogame', { gameId });
});


router.get('/game/:id/wait', isAuthenticated, async (req, res) => {

    /*
    TODO
    
    1. send invitation

    2. update wait room message via socket
    */
 
    

    const { id: gameId } = req.params;
    const user = Session.getCurrentUser(req);
    const playersList = await UserDB.getAllUsers();

    res.render('waitroom', { gameId, user, playersList });
});

// For testing chat in the unogame.ejs waitroom.ejs without authentication
// will delete later, after lobby.ejs is updated with game list
router.post("/chat/:id", Chat.sendMessage);

export default router;