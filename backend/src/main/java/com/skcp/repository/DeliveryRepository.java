package com.skcp.repository;

import com.skcp.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Integer>
{

}


/*
By Extending:    JpaRepository<Delivery, Integer>    - No SQL needs to be written.

save()
findAll()
findById()
deleteById()
existsById()
count()
saveAll()
deleteAll()


*/