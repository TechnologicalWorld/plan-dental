<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('evalua', function (Blueprint $table) {
            $table->unsignedBigInteger('idSesion');
            $table->unsignedBigInteger('idOdontograma');
            $table->date('fecha');

            $table->foreign('idSesion')->references('idSesion')->on('sesion')->onDelete('cascade');
            $table->foreign('idOdontograma')->references('idOdontograma')->on('odontograma')->onDelete('cascade');
            
            $table->primary(['idSesion', 'idOdontograma']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evalua');
    }
};
