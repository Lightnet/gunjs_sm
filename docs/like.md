var like = (postId) => {
      var item = likes.get(postId);
      item.once(function(data){ 
        if(!data) likes = 0;
        item.put(likes++);
      })
    }
	
	
like(postId) {
    var likes = this.db.get('likes');
    
      var item = likes.get(postId);
      item.once(function(data){ 
        if(!data) likes = 0;
        item.put(likes++);
      })
    
    likes.on(async(data,postId)=>{
      let likes = await likes.get().then();
      var post = this.db.user().get(postId);
      post.put({likes:likes})
    })
   }