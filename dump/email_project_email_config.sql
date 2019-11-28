-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: email_project
-- ------------------------------------------------------
-- Server version	5.7.27-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `email_config`
--

DROP TABLE IF EXISTS `email_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_config` (
  `email_config_id` int(11) NOT NULL AUTO_INCREMENT,
  `ds_email` varchar(200) DEFAULT NULL,
  `ds_password` text,
  `flg_office365` enum('OFFICE365','GMAIL') DEFAULT NULL,
  PRIMARY KEY (`email_config_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_config`
--

LOCK TABLES `email_config` WRITE;
/*!40000 ALTER TABLE `email_config` DISABLE KEYS */;
INSERT INTO `email_config` VALUES (1,'helpper@controlejundiai.com.br','a88821ad87edd025f579c9ac5871f2f540b5188cc4c22b6bccaacf62dff46b83bac8bf46fa050b333d58db763b4ea9b43af7c5d5426df00e351c5a5831a5f1becf7f14aeaecab6478c77f9b95ad265e834cc231f8359ed4ba50d4148f5d589f4b50661f17bb82a2bfbda60c0','OFFICE365'),(2,'mmacedo_90@hotmail.com','b073fb76ecef36999b84b495c4f9afce49d44917d74fd00433987aa09f7e3f8f5228051841a1877a67bc4079d119f4c68423ef217cba75ff3404c4df2b03e14bd4e5ede33af007d2be5545cdb1636e0a69324a51fcd98303004a2ca8dc08b4459331b32594ca9ef6ed','OFFICE365'),(3,'dedeuca2004@hotmail.com','cba93c74095c97f8995437d3371dc22406d72c7333cb0e3a462302015f71fbbebf745747753c53ed392a0d92bb21e0dd38ec65af1b1937090f88be6e0825c9ea1065a16413fbccd4b404c7398f122250b3f07fbab3dae842156b3d7e2aa99ab65121a149dd7b05215f','OFFICE365'),(4,'adriano.bastos@hotmail.com.br','3ca9371d7c42d65f70c568b81d39393536a906c23f6e5416da0166448c9bdf0a58da4b83a59463daede41c17992a4c94e93f3d13264785a08ed0d5bcf71d0f13d6b5801bc45b112d67dd115fba3202323d1306d680915b40cc608372bd5a682d7f9cef775c1294bd422872fe92','OFFICE365');
/*!40000 ALTER TABLE `email_config` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-28 16:50:31
