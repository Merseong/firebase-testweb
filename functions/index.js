const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.refreshRank = functions.database.ref('/user-count/{pushId}')
.onWrite((snapshot, context) =>
{
    const playerObj = snapshot.after.val();
    const rankingRef = admin.database().ref('/ranking');
    return rankingRef.once('value').then(objSnapshot =>
        {
            if (objSnapshot.exists())
            {
                var rankingObj = objSnapshot.val();
                var newRankingObj = {};

                if (rankingObj.first.uid === context.params.pushId)
                {
                    newRankingObj = { first: 
                        {
                            username: playerObj.username,
                            uid: context.params.pushId,
                            count: playerObj.count
                        }};
                }
                else if (rankingObj.second.uid === context.params.pushId) // 1등을 2등으로, 2등을 3등으로 하고 1등에 넣기
                {
                    if (rankingObj.first.count < playerObj.count)
                    {
                        newRankingObj = 
                        {
                            first: 
                            {
                                username: playerObj.username,
                                uid: context.params.pushId,
                                count: playerObj.count
                            },
                            second: 
                            {
                                username: rankingObj.first.username,
                                uid: rankingObj.first.uid,
                                count: rankingObj.first.count
                            },
                            third: 
                            {
                                username: rankingObj.second.username,
                                uid: rankingObj.second.uid,
                                count: rankingObj.second.count
                            }
                        }
                    }
                    else
                    {
                        newRankingObj = {second:
                            {
                                username: playerObj.username,
                                uid: context.params.pushId,
                                count: playerObj.count
                            }};
                    }
                }
                else if (rankingObj.third.uid === context.params.pushId) // 2등을 3등으로, 2등에 넣기
                {
                    if (rankingObj.second.count < playerObj.count)
                    {
                        newRankingObj = 
                        {
                            second: 
                            {
                                username: playerObj.username,
                                uid: context.params.pushId,
                                count: playerObj.count
                            },
                            third: 
                            {
                                username: rankingObj.second.username,
                                uid: rankingObj.second.uid,
                                count: rankingObj.second.count
                            }
                        }
                    }
                    else
                    {
                        newRankingObj = {third:
                            {
                                username: playerObj.username,
                                uid: context.params.pushId,
                                count: playerObj.count
                            }};
                    }
                }
                else if (rankingObj.third.count < playerObj.count) // 3등 갈아끼우기
                {
                    newRankingObj = 
                    {
                        third: 
                        {
                            username: playerObj.username,
                            uid: context.params.pushId,
                            count: playerObj.count
                        }
                    }
                }
                return rankingRef.update(newRankingObj);
            }
            else
            {
                return rankingRef.set(
                    {
                        first: 
                        {
                            username: playerObj.username,
                            uid: context.params.pushId,
                            count: playerObj.count
                        },
                        second: 
                        {
                            username: '',
                            uid: 0,
                            count: 0
                        },
                        third: 
                        {
                            username: '',
                            uid: 0,
                            count: 0
                        }
                    }
                );
            }
        });
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
