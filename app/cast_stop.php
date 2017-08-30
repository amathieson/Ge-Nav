<?php
/**
 * Created by PhpStorm.
 * User: Adam
 * Date: 28/07/2017
 * Time: 21:04
 */
header('Access-Control-Allow-Origin: *');
require "cast_sql.php";
$stop = "SGGA";

//file_put_contents("stops.txt",file_get_contents("stops.txt") . $stop . "\n");
$url = "http://prod.ivtr-od.tpg.ch/v1/GetNextDepartures.json?key=p5WasThkrBKsRdqxBNvm&stopCode=$stop";
$data = file_get_contents($url);
$json = json_decode($data);
//var_dump($json->departures[0]);
?>
    <li>
        <a hidden style="display: none" href="#" onclick="" class="item-link item-content">
            <div class="item-inner">
                <div class="item-title-row">
                    <div class="item-title">Sergy-Gare Departures</div>
                </div>
            </div>
        </a>
    </li>
<?php
foreach ($json->departures as $departure) {
    if ($departure->waitingTime != "no more") {
        $colors = getLineData($departure->line->lineCode);
        ?>

        <li style="background-color: #<?php echo $colors['primary_color'];?>; color: #<?php echo $colors['text_color'];?>;">
            <a hidden style="display: none" href="http://www.tpgapp.ga/hosted_app/dep.php?dc=<?=$departure->departureCode?>" onclick="document.getElementById('navbar').style.color = '#<?php echo $colors['text_color'];?>'; document.getElementById('navbar').style.backgroundColor = '#<?php echo $colors['primary_color'];?>'; document.getElementById('title').innerHTML = '<?=$departure->line->lineCode?>&nbsp;&nbsp;&rarr;&nbsp;&nbsp;<?=$departure->line->destinationName?>';myApp.showPreloader();setTimeout(function () {myApp.hidePreloader();}, 4500);document.getElementById('currDepCode').innerHTML = '<?=$departure->departureCode?>'" class="item-link item-content">
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-title"><?=$departure->line->lineCode?>&nbsp;&nbsp;<i style="position: relative; top: 4px;" class="f7-icons">arrow_right</i>&nbsp;&nbsp;<?=$departure->line->destinationName?></div>
                        <div class="item-after" style="background-color: #<?php echo $colors['primary_color'];?>; color: #<?php echo $colors['text_color'];?>;"><?=$departure->waitingTime?> <?php if($departure->waitingTime != "&gt;1h"){echo "mins";} ?></div>
                    </div>
                    <!--                <div class="item-subtitle">New messages from John Doe</div>-->
                    <!--                <div class="item-text">Lorem ipsum dolor sit amet...</div>-->
                </div>
            </a>
        </li>
        <?php
    }
}
?>
    <li>
        <a hidden style="display: none" href="#" onclick="" class="item-link item-content">
            <div class="item-inner">
                <div class="item-title-row">
                    <div class="item-title">CERN Departures</div>
                </div>
            </div>
        </a>
    </li>
<?php
$stop = "CERN";

//file_put_contents("stops.txt",file_get_contents("stops.txt") . $stop . "\n");
$url = "http://prod.ivtr-od.tpg.ch/v1/GetNextDepartures.json?key=p5WasThkrBKsRdqxBNvm&stopCode=$stop";
$data = file_get_contents($url);
$json = json_decode($data);
//var_dump($json->departures[0]);
?>
<?php
foreach ($json->departures as $departure) {
    if ($departure->waitingTime != "no more") {
        $colors = getLineData($departure->line->lineCode);
        ?>

        <li style="background-color: #<?php echo $colors['primary_color'];?>; color: #<?php echo $colors['text_color'];?>;">
            <a hidden style="display: none" href="http://www.tpgapp.ga/hosted_app/dep.php?dc=<?=$departure->departureCode?>" onclick="document.getElementById('navbar').style.color = '#<?php echo $colors['text_color'];?>'; document.getElementById('navbar').style.backgroundColor = '#<?php echo $colors['primary_color'];?>'; document.getElementById('title').innerHTML = '<?=$departure->line->lineCode?>&nbsp;&nbsp;&rarr;&nbsp;&nbsp;<?=$departure->line->destinationName?>';myApp.showPreloader();setTimeout(function () {myApp.hidePreloader();}, 4500);document.getElementById('currDepCode').innerHTML = '<?=$departure->departureCode?>'" class="item-link item-content">
                <div class="item-inner">
                    <div class="item-title-row">
                        <div class="item-title"><?=$departure->line->lineCode?>&nbsp;&nbsp;<i style="position: relative; top: 4px;" class="f7-icons">arrow_right</i>&nbsp;&nbsp;<?=$departure->line->destinationName?></div>
                        <div class="item-after" style="background-color: #<?php echo $colors['primary_color'];?>; color: #<?php echo $colors['text_color'];?>;"><?=$departure->waitingTime?> mins</div>
                    </div>
                    <!--                <div class="item-subtitle">New messages from John Doe</div>-->
                    <!--                <div class="item-text">Lorem ipsum dolor sit amet...</div>-->
                </div>
            </a>
        </li>
        <?php
    }
}
?>