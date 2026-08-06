package com.skcp.repository;

import com.skcp.entity.CuringStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuringStockRepository extends JpaRepository<CuringStock, Integer> {

}