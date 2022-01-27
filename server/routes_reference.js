const dbo = require('./mongoconn');
const axios = require('axios');
const Fernet = require('./f')

function error_message(str) {
  return { status: 404, success: false, error: true, message: str };
}

async function validate_user(req, res) {
  const body = req.body;

  if (!body.consignerId && !body.key && !body.discordId) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    // find in mongo

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Keys')
    .findOne(body, function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });

    // res.json({ hi: 1000 });
  }
}

async function get_all_sales(req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Sale')
  .find({})
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_single_sale(req, res) {
  if (!req.params.shortCode) {
    res.status(404).json(error_message("Missing shortCode to identify sale"));
    return;
  }

  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Sale')
  .find({ shortCode: req.params.shortCode })
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_single_user(req, res) {
  if (!req.params.discordId) {
    res.status(404).json(error_message("Missing discordId to identify user"));
    return;
  }

  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Users')
  .find({ discordId: req.params.discordId })
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_all_actives(req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Active')
  .find({})
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_all_paids(req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Paid')
  .find({})
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_all_users(req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
  .collection('Users')
  .find({})
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_all_tempusers(req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
  .collection('TempUsers')
  .find({})
  .toArray(function (err, result) {
    if (err) {
      res.status(404).json(error_message("Error in DB"));
    } else {
      res.json(result);
    }
  });
}

async function get_my_sales(req, res) {
  if (!req.params.consignerId) {
    res.status(404).json(error_message("Missing consigner ID"));
  } else {
    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Sale')
    .find({ consignerId: req.params.consignerId })
    .toArray(function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });
  }
}

async function get_my_actives(req, res) {
  if (!req.params.consignerId) {
    res.status(404).json(error_message("Missing consigner ID"));
  } else {
    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Active')
    .find({ consignerId: req.params.consignerId })
    .toArray(function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });
  }
}

async function get_my_paids(req, res) {
  if (!req.params.consignerId) {
    res.status(404).json(error_message("Missing consigner ID"));
  } else {
    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Paid')
    .find({ consignerId: req.params.consignerId })
    .toArray(function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });
  }
}

async function get_prefill_by_key(req, res) {
  if (!req.params.key) {
    res.status(404).json(error_message("Missing key"));
  } else {

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Users')
    .findOne({ key: req.params.key }, function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });
  }
}

async function get_temp_user_by_discord_id(req, res) {
  if (!req.params.discordId) {
    res.status(404).json(error_message("Missing key"));
  } else {

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('TempUsers')
    .findOne({ discordId: req.params.discordId }, function (err, result) {
      if (err) {
        res.status(404).json(error_message("Error in DB"));
      } else {
        res.json(result);
      }
    });
  }
}

function all_defined(data, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (data[keys[i]] === undefined) {
      console.log(keys[i])
      return false;
    }
  }
  return true;
}

async function post_sale(req, res) {
  const content = req.body;
  const req_keys = ['shortCode', 'title', 'receivedAt',
  'price', 'option1', 'option2', 'consignerName', 'orderDate',
  'orderNumber', 'productSku', 'createdAt', 'consignerId'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const new_content = {
      // '_id': content['id'],
      'shortCode': content['shortCode'],
      'title': content['title'],
      'receivedAt': content['receivedAt'],
      'price': content['price'],
      'option1': content['option1'],
      'option2': content['option2'],
      'consignerName': content['consignerName'],
      'orderDate': content['orderDate'],
      'orderNumber': content['orderNumber'],
      'sku': content['productSku'],
      'createdAt': content['createdAt'],
      'consignerId': content['consignerId'],
      // 'userId': content['userId']
    }
    if (content.locationName !== undefined) {
      new_content.location = content.locationName;
    }
    if (content['pricePaid'] !== undefined) {
      new_content['pricePaid'] = content['pricePaid']
    }

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Sale')
    .updateOne({ shortCode: content['shortCode']}, { $set: new_content }, { upsert: true })
    .then(obj => {
      res.status(201).json(new_content);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function post_paid(req, res) {
  const content = req.body;
  const req_keys = ['shortCode', 'title', 'receivedAt',
  'price', 'option1', 'option2', 'consignerName', 'orderDate',
  'orderNumber', 'productSku', 'createdAt', 'consignerId'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const new_content = {
      // '_id': content['id'],
      'shortCode': content['shortCode'],
      'title': content['title'],
      'receivedAt': content['receivedAt'],
      'price': content['price'],
      'option1': content['option1'],
      'option2': content['option2'],
      'consignerName': content['consignerName'],
      'orderDate': content['orderDate'],
      'orderNumber': content['orderNumber'],
      'sku': content['productSku'],
      'createdAt': content['createdAt'],
      'consignerId': content['consignerId'],
      // 'userId': content['userId']
    }
    if (content.locationName !== undefined) {
      new_content.location = content.locationName;
    }
    if (content['pricePaid'] !== undefined) {
      new_content['pricePaid'] = content['pricePaid']
    }

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Paid')
    .updateOne({ shortCode: content['shortCode']}, { $set: new_content }, { upsert: true })
    .then(obj => {
      res.status(201).json(new_content);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function post_active(req, res) {
  const content = req.body;
  const req_keys = ['shortCode', 'title', 'receivedAt',
  'price', 'option1', 'option2', 'consignerName', 'orderDate',
  'orderNumber', 'productSku', 'createdAt', 'consignerId'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const new_content = {
      // '_id': content['id'],
      'shortCode': content['shortCode'],
      'title': content['title'],
      'receivedAt': content['receivedAt'],
      'price': content['price'],
      'option1': content['option1'],
      'option2': content['option2'],
      'consignerName': content['consignerName'],
      'orderDate': content['orderDate'],
      'orderNumber': content['orderNumber'],
      'sku': content['productSku'],
      'createdAt': content['createdAt'],
      'consignerId': content['consignerId'],
      // 'userId': content['userId']
    }
    if (content.locationName !== undefined) {
      new_content.location = content.locationName;
    }
    if (content['pricePaid'] !== undefined) {
      new_content['pricePaid'] = content['pricePaid']
    }

    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Active')
    .updateOne({ shortCode: content['shortCode']}, { $set: new_content }, { upsert: true })
    .then(obj => {
      res.status(201).json(new_content);
    })
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function update_item(req, res) {
  const content = req.body;
  const req_keys = ['shortCode', 'pricePaid'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const new_content = {
      'pricePaid': content['pricePaid'],
    }
    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Active')
    .updateOne({ shortCode: content['shortCode']}, { $set: new_content })
    .then(obj => dbConnect.collection('Sale').updateOne({ shortCode: content['shortCode']}, { $set: new_content }))
    .then(obj => dbConnect.collection('Paid').updateOne({ shortCode: content['shortCode']}, { $set: new_content }))
    .then(obj => res.status(201).json(new_content))
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function post_key(req, res) {
  const content = req.body;
  const req_keys = ['discordId'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const dbConnect = dbo.getDb();

    dbConnect
    .collection('Keys')
    .updateOne({ discordId: content['discordId']}, { $set: content }, { upsert: true })
    .then(obj => res.status(201).json(content))
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function post_new_user(req, res) {
  const content = req.body;
  const req_keys = ['pw', 'soldWh', 'paidWh', 'activeWh', 'statsWh', 'email', 'key'];

  if (!all_defined(content, req_keys) || !req.params.discordId) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const dbConnect = dbo.getDb();

    const new_content = {
      ...content,
      discordId: req.params.discordId
    }

    dbConnect
    .collection('Users')
    .updateOne({ discordId: req.params.discordId }, { $set: new_content }, { upsert: true })
    .then(obj => res.status(201).json(content))
    .catch(err => {
      console.log(err);
      res.status(404).json(error_message("Error in DB"));
    })
  }
}

async function post_temp_user(req, res) {
  const content = req.body;
  const req_keys = ['discordId', 'pw', 'soldWh', 'paidWh', 'activeWh', 'statsWh', 'email', 'key'];

  if (!all_defined(content, req_keys) || !req.params.discordId) {
    res.status(404).json(error_message("Missing valid keys"));
  }

  const dbConnect = dbo.getDb();

  const q = { discordId: req.params.discordId };
  const amount_users = await dbConnect.collection('Users').count(q);
  const amount_temp_users = await dbConnect.collection('TempUsers').count(q);

  if (amount_temp_users !== 0 || amount_users !== 0) {
    res.status(404).json(error_message("You have already set up your account with us. Please use the Discord server if you need to change any of the details below."));
    return;
  } else {
    const amount_keys = await dbConnect.collection('Keys').count({ ...q, key: content.key });
    if (amount_keys < 1) {
      res.status(404).json(error_message("This key is invalid."));
      return;
    } else {
      const encrypted = Fernet.encrypt(content.pw);
      const relayed = Fernet.decrypt(encrypted);

      if (content.pw !== relayed) {
        res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42090"));
        return;
      }

      q.pw = encrypted;
      q.statsWh = content.statsWh;
      q.soldWh = content.soldWh;
      q.paidWh = content.paidWh;
      q.activeWh = content.activeWh;

      q.email = content.email.toLowerCase().trim();
      q.key = content.key;

      try {
        const new_temp_result = await dbConnect
        .collection('TempUsers')
        .updateOne({ discordId: req.params.discordId }, { $set: q }, { upsert: true });
        res.status(201).json({ ...q, success: true });
      } catch (err) {
        console.log(err);
        res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42091"));
      }
    }
  }
}

async function validate_webhooks(req, res) {
  Promise.all(req.body.map(thing => axios.get(thing.url)))
  .then((values) => {
    var all_200 = true;
    var bad = 0;0
    for (var i = 0; i < values.length; i++) {
      all_200 = all_200 && values[i].status == 200;

      if (!all_200) {
        bad = i;
        break;
      }
    }
    if (all_200) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json(error_message(`Your ${content[i].type} webhook is invalid. Please insert a new one.`));
    }

  })
  .catch(e => res.status(404).json(error_message(`One or more of your webhooks is invalid. Please insert a new one.`)));
}

async function update_user(req, res) {
  const content = req.body;
  const req_keys = ['discordId', 'key'];

  if (!all_defined(content, req_keys)) {
    res.status(404).json(error_message("Missing valid keys"));
  } else {
    const dbConnect = dbo.getDb();
    // check if the user exists
    dbConnect.collection('Keys').count({ discordId: content.discordId, key: content.key }, function(error, num_of_docs) {
      if (error) {
        res.status(404).json(error_message("Error updating user"));
      } else {
        if (num_of_docs < 1) {
          res.status(404).json(error_message("This key is invalid."))
        } else {
          const new_content = {
            consignerId: content.consignerId
          }

          const colls = ['TempUsers', 'Users', 'Keys'];
          Promise.all(colls.map(c => dbConnect
            .collection(c)
            .updateOne({ discordId: content.discordId }, { $set: new_content })))
            .then(values => res.status(201).json({
              "success": true,
              "message": "Your account was successfully updated."
            }));
          }
        }

        // db.close();
        // callback(null, numOfDocs);
      });

    }
  }

  async function delete_user(req, res) {
    // check if discordId is in the URL
    if (!req.params.discordId) {
      res.status(404).json(error_message("Missing discordId to delete"));
      return;
    }

    // connect to DB
    const dbConnect = dbo.getDb();

    // tries to delete, gives 204 on delete, 404 on some error
    try {
      const result1 = await dbConnect.collection('TempUsers').deleteOne({ discordId: req.params.discordId });
      const result2 = await dbConnect.collection('Users').deleteOne({ discordId: req.params.discordId });

      if (result1.deletedCount === 1 || result2.deletedCount === 1) {
        res.status(204).json({
          "success": true,
          "message": "Active item successfully deleted",
          "status": 204
        });
        return;
      } else {
        res.status(404).json({
          "success": false,
          "message": 'User not deleted',
          "status": 404
        });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42093"));
    }

  }

  async function delete_active(req, res) {
    // check if shortCode is in the URL
    if (!req.params.shortCode) {
      res.status(404).json(error_message("Missing shortCode to delete"));
      return;
    }

    // connect to DB
    const dbConnect = dbo.getDb();

    // tries to delete, gives 204 on delete, 404 on some error
    try {
      const result = await dbConnect.collection('Active').deleteOne({ shortCode: req.params.shortCode });
      res.status(204).json({
        'success': true,
        'message': "Active item successfully deleted"
      });
    } catch (err) {
      console.log(err);
      res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42092"));
    }
  }

  async function delete_user2(req, res) {
    // check if shortCode is in the URL
    console.log(`Deleting user`, req.query);
    if (!req.query.discordId && !req.query.key && !req.query.email) {
      res.status(404).json(error_message("Missing identifying keys to delete"));
      return;
    }

    const delete_by = {};

    if (req.query.discordId) {
      delete_by.discordId = req.query.discordId;
    } else if (req.query.key) {
      delete_by.key = req.query.key;
    } else {
      delete_by.email = req.query.email;
    }

    // connect to DB
    const dbConnect = dbo.getDb();

    // tries to delete, gives 204 on delete, 404 on some error
    // try {
    //   const result = await dbConnect.collection(req.query.temp === "true" ? 'TempUsers' : "Users").deleteOne(delete_by);
    //   res.status(204).json({
    //     'success': true,
    //     'message': "Active item successfully deleted"
    //   });
    // } catch (err) {
    //   console.log(err);
    //   res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42092"));
    // }

    try {
      const result1 = await dbConnect.collection('TempUsers').deleteOne(delete_by);
      const result2 = await dbConnect.collection('Users').deleteOne(delete_by);

      if (result1.deletedCount === 1 || result2.deletedCount === 1) {
        res.status(204).json({
          "success": true,
          "message": "Active item successfully deleted",
          "status": 204
        });
        // return;
      } else {
        res.status(404).json({
          "success": false,
          "message": 'User not deleted',
          "status": 404
        });
        // return;
      }
    } catch (err) {
      console.log(err);
      res.status(404).json(error_message("There was an internal error during your setup. Please contact an admin on Discord now. Error code 42093"));
    }
  }



  module.exports = {
    validate_user,
    get_all_sales,
    get_all_actives,
    get_all_paids,
    get_my_sales,
    get_my_actives,
    get_my_paids,
    get_all_users,
    get_all_tempusers,
    get_prefill_by_key,
    get_temp_user_by_discord_id,
    post_sale,
    post_paid,
    post_active,
    update_item,
    post_key,
    post_new_user,
    validate_webhooks,
    update_user,
    post_temp_user,
    delete_user,
    delete_active,
    get_single_sale,
    get_single_user,
    delete_user2
}
