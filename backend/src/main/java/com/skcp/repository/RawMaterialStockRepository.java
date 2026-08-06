package com.skcp.repository;

import com.skcp.entity.RawMaterialStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RawMaterialStockRepository extends JpaRepository<RawMaterialStock, Integer> {

}