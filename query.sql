SELECT profil.profile_picture, profil.user_id, user.age, user.user_name, user.score, user.gender, user.activated FROM profil
LEFT JOIN user ON user.id = profil.user_id
WHERE profil.user_id IN
(SELECT count_tags.user_id FROM
(SELECT COUNT(profil.user_id) AS count, profil.user_id FROM profil LEFT JOIN user_interet ON user_interet.user_id = profil.user_id LEFT JOIN interets ON interets.id = user_interet.interets_id WHERE interets.tag IN ('blue', 'yellow', 'black') GROUP BY profil.user_id)
AS count_tags WHERE count_tags.count >= 3)


(SELECT count_tags.user_id, count_tags.count FROM (SELECT COUNT(profil.user_id) AS count, profil.user_id FROM profil LEFT JOIN user_interet ON user_interet.user_id = profil.user_id LEFT JOIN interets ON interets.id = user_interet.interets_id WHERE interets.tag IN ('blue', 'yellow', 'black') GROUP BY profil.user_id) AS count_tags) AS count_tags