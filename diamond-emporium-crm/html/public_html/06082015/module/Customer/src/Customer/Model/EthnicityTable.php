<?php
namespace Customer\Model;

use Zend\Db\TableGateway\TableGateway;

class EthnicityTable
{
	protected $tableGateway;
	
	public function __construct(TableGateway $tableGateway)
	{
		$this->tableGateway = $tableGateway;
	}

	public function fetchSelectOptions()
	{
		try{
			$select = new \Zend\Db\Sql\Select();
			$select->from('de_ethnicity');
			$select->columns(array('id', 'ethnicity'));
			$result = $this->tableGateway->selectWith($select)->toArray();
			
			$options = array(0 => 'Select');
			foreach($result as $value){
				$options[$value['id']] = $value['ethnicity'];
			}
			return $options;
		}catch(\Exception $e){
			\De\Log::logApplicationInfo ( "Caught Exception: " . $e->getMessage () . ' -- File: ' . __FILE__ . ' Line: ' . __LINE__ );
		}
	}
}