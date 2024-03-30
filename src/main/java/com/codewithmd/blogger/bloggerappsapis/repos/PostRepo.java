package com.codewithmd.blogger.bloggerappsapis.repos;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.codewithmd.blogger.bloggerappsapis.entities.Category;
import com.codewithmd.blogger.bloggerappsapis.entities.Comment;
import com.codewithmd.blogger.bloggerappsapis.entities.Post;
import com.codewithmd.blogger.bloggerappsapis.entities.SavePost;
import com.codewithmd.blogger.bloggerappsapis.entities.User;

public interface PostRepo extends JpaRepository<Post, Integer> {

	List<Post> findByUser(User u, Sort sort);

	List<Post> findByUser(User u);

	List<Post> findByCategory(Category c);

	List<Post> findByCategoryAndUser(Category c, User u);

	@Query("select p from Post p where p.isPostContentChecked = false")
	List<Post> findAllPostUnCheckedContent();

	@Query("select p from Post p where p.susbscriberEmail = false")
	List<Post> findAllPostNewContent();

	@Modifying
	@Transactional
	@Query(value = "Update Post p set p.isPostContentChecked = true WHERE p.isPostContentChecked = false ")
	public void updatePostUnCheckedContent();

	@Query("select count(p) from Post p where p.postId =?1")
	public int checkId(Integer id);

	@Query("select p from Post p where p.postId in ?1")
	public List<Post> getPostByIds(List<Integer> ids);



	@Query("SELECT p FROM Post p ORDER BY p.likePost desc")
	public Page<Post> getPostsSortedByLike(Pageable p);

	@Query("SELECT p FROM Post p ORDER BY p.numberOfViews desc")
	public Page<Post> getPostsSortedByViews(Pageable p);

 

	@Query("SELECT p FROM Post p ORDER BY  p.date ASC")
	public Page<Post> getPostsSortedByOld(Pageable p);

	@Query("SELECT p FROM Post p ORDER BY  p.date DESC")
	public Page<Post> getPostsSortedByNew(Pageable p);
	
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.comments c GROUP BY p.id ORDER BY COUNT(c) DESC")
    List<Post> getPostsSortedByComments();

	@Query("SELECT p FROM Post p ORDER BY  p.recommendedPost desc")
	public Page<Post> getRecommendedPosts(Pageable p);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key ORDER BY  p.date DESC")
	List<Post> findByKeyword(@Param("key") String key);
	
	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE (p.user.id = :userId) AND (p.title LIKE %:key% OR p.content LIKE %:key% OR u.name LIKE %:key%) ORDER BY p.date DESC")
	List<Post> findByKeyword(@Param("key") String key, @Param("userId") Integer userId);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key ORDER BY  p.recommendedPost desc")
	List<Post> findByKeywordAndRecommend(@Param("key") String key);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key  ORDER BY  p.date DESC")
	List<Post> findByKeywordAndNew(@Param("key") String key);
	
	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE (p.user.id = :userId) AND (p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key)  ORDER BY  p.date DESC")
	List<Post> findByKeywordAndNew(@Param("key") String key, @Param("userId") Integer userId);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key  ORDER BY  p.date ASC")
	List<Post> findByKeywordAndOld(@Param("key") String key);
	
	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE (p.user.id = :userId) AND (p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key)  ORDER BY  p.date ASC")
	List<Post> findByKeywordAndOld(@Param("key") String key, @Param("userId") Integer userId);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key  ORDER BY  p.comments desc")
	List<Post> findByKeywordAndComments(@Param("key") String key);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key   ORDER BY p.numberOfViews desc")
	List<Post> findByKeywordAndViews(@Param("key") String key);

	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key   ORDER BY p.likePost desc")
	List<Post> findByKeywordAndLike(@Param("key") String key);
	
	@Query("select p from Post p where p.user.id in ?1 order by p.date desc")
	public Page<Post> getPostByUserIds(List<Integer> userIds, Pageable p);
	
	@Query("SELECT p FROM Post p LEFT JOIN p.user u WHERE p.title LIKE :key OR p.content LIKE :key OR u.name LIKE :key and p.user.id in :userId ORDER BY p.date desc")
	public List<Post> getPostByKeywordAndUserIds(@Param("key") String key,List<Integer> userId);
	
	// Post findByUserAndPost(User user,Post p);

//	Optional<Post> findByUserIdAndPostId(Integer userId, Integer postId);
}
