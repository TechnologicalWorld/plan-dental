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
        Schema::create('sesion', function (Blueprint $table) {
            $table->id('idSesion');
            $table->string('nombre', 100);
            $table->text('descripcion')->nullable();
            $table->time('hora')->nullable();
            $table->text('observacion')->nullable();
            $table->date('fecha')->nullable();
            
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesion');
    }
};
