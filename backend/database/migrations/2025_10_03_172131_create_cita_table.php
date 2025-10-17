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
        Schema::create('cita', function (Blueprint $table) {
            $table->id('idCita');
            $table->time('hora')->nullable();
            $table->date('fecha')->nullable();
            $table->enum('estado', ['cancelada', 'cumplida', 'pospuesta']);
            $table->string('tipoCita', 100)->nullable();
            $table->decimal('costo',8,2);
            $table->decimal('pagado',8,2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cita');
    }
};
